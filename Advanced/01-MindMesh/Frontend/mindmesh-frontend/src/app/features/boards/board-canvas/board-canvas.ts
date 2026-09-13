import { Component, inject, OnInit, OnDestroy, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, RouterLink } from '@angular/router';
import * as signalR from '@microsoft/signalr';
import { PopupService } from '../../../shared/services/popup.service';
import { ToastService } from '../../../shared/services/toast.service';
import { FormsModule } from '@angular/forms';

interface ICard {
  id: number;
  content: string;
  x: number;
  y: number;
  color: string;
}

interface IConnection {
  id: number;
  fromCardId: number;
  toCardId: number;
  color: string;
}

@Component({
  selector: 'app-board-canvas',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './board-canvas.html',
  styles: [`
    :host {
      display: block;
      position: relative;
      background-image: 
        linear-gradient(rgba(0,0,0,0.04) 1px, transparent 1px),
        linear-gradient(90deg, rgba(0,0,0,0.04) 1px, transparent 1px);
      background-size: 40px 40px;
      background-color: #f8fafc;
      min-height: 100vh;
    }
  `]
})
export class BoardCanvas implements OnInit, OnDestroy {
  private http = inject(HttpClient);
  private route = inject(ActivatedRoute);
  private popup = inject(PopupService);
  private toast = inject(ToastService);

  private hubConnection: signalR.HubConnection | null = null;
  private boardId!: number;

  cards = signal<ICard[]>([]);
  connections = signal<IConnection[]>([]);
  draggingCardId = signal<number | null>(null);
  selectedCardId = signal<number | null>(null);
  newCardText = signal('');
  selectedColor = '#FBBF24';
  selectedStrokeColor = '#94a3b8';

  async ngOnInit() {
    this.boardId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadCards();
    this.loadConnections();
    await this.connectSignalR();
  }

  loadCards() {
    this.http.get<ICard[]>(`https://localhost:7167/api/cards/board/${this.boardId}`).subscribe({
      next: (data) => this.cards.set(data)
    });
  }

  loadConnections() {
    this.http.get<IConnection[]>(`https://localhost:7167/api/connections/board/${this.boardId}`).subscribe({
      next: (data) => this.connections.set(data)
    });
  }

  async connectSignalR() {
    try {
      this.hubConnection = new signalR.HubConnectionBuilder()
        .withUrl('https://localhost:7167/hub/board', { withCredentials: true })
        .build();

      this.hubConnection.on('CardMoved', (cardId: number, x: number, y: number) => {
        this.cards.update((list) => list.map((c) => (c.id === cardId ? { ...c, x, y } : c)));
      });

      this.hubConnection.on('ConnectionCreated', (connId: number, from: number, to: number, color: string) => {
        this.connections.update(list => [...list, { id: connId, fromCardId: from, toCardId: to, color }]);
      });

      this.hubConnection.on('ConnectionDeleted', (connId: number) => {
        this.connections.update(list => list.filter(c => c.id !== connId));
      });

      await this.hubConnection.start();
      await this.hubConnection.invoke('JoinBoard', this.boardId.toString());
    } catch (error) {
      this.toast.show('تعذر الاتصال بالخادم للتعاون الفوري', 'error');
    }
  }

  onCreateCard() {
    if (!this.newCardText().trim()) return;
    this.http.post<{ id: number }>('https://localhost:7167/api/cards', {
      boardId: this.boardId,
      content: this.newCardText(),
      x: 100,
      y: 100,
      color: this.selectedColor
    }).subscribe({
      next: () => {
        this.newCardText.set('');
        this.loadCards();
      },
      error: () => this.toast.show('فشل إنشاء البطاقة', 'error')
    });
  }

  onCardClick(cardId: number) {
    console.log('Clicked card:', cardId);
    console.log('Current cards:', this.cards());

    const selected = this.selectedCardId();

    console.log('Selected card:', selected);

    if (selected === null) {
      this.selectedCardId.set(cardId);
      return;
    }

    if (selected === cardId) {
      this.selectedCardId.set(null);
      return;
    }

    this.http.post<{ id: number }>('https://localhost:7167/api/connections', {
      boardId: this.boardId,
      fromCardId: selected,
      toCardId: cardId,
      color: this.selectedStrokeColor
    }).subscribe({
      next: (res) => {
        this.toast.show('تم إنشاء الرابط', 'success');
        this.selectedCardId.set(null);
        this.loadConnections();

        if (this.hubConnection?.state === signalR.HubConnectionState.Connected) {
          this.hubConnection.invoke(
            'NotifyConnectionCreated',
            this.boardId.toString(),
            res.id,
            selected,
            cardId,
            this.selectedStrokeColor
          );
        }
      },
      error: () => this.toast.show('فشل إنشاء الرابط', 'error')
    });
  }

  deleteConnection(connectionId: number) {
    this.http.delete(`https://localhost:7167/api/connections/${connectionId}`).subscribe({
      next: () => {
        this.toast.show('تم حذف الرابط', 'success');
        this.loadConnections();
        if (this.hubConnection?.state === signalR.HubConnectionState.Connected) {
          this.hubConnection.invoke('NotifyConnectionDeleted', this.boardId.toString(), connectionId);
        }
      },
      error: () => this.toast.show('فشل حذف الرابط', 'error')
    });
  }

  onDragStart(cardId: number) {
    this.draggingCardId.set(cardId);
  }

  onDrag(event: MouseEvent) {
    const cardId = this.draggingCardId();
    if (cardId === null) return;
    const newX = event.clientX - 60;
    const newY = event.clientY - 40;
    this.cards.update((list) =>
      list.map((c) => (c.id === cardId ? { ...c, x: newX, y: newY } : c))
    );
    if (this.hubConnection?.state === signalR.HubConnectionState.Connected) {
      this.hubConnection.invoke('NotifyCardMoved', this.boardId.toString(), cardId, newX, newY)
        .catch(err => console.error(err));
    }
  }

  onDragEnd() {
    const cardId = this.draggingCardId();
    if (cardId === null) return;
    const card = this.cards().find((c) => c.id === cardId);
    if (card) {
      this.http.patch('https://localhost:7167/api/cards/move', { cardId, x: card.x, y: card.y })
        .subscribe({
          error: () => this.toast.show('فشل تحديث موقع البطاقة', 'error')
        });
    }
    this.draggingCardId.set(null);
  }

  async onDeleteCard(cardId: number) {
    const confirmed = await this.popup.confirm({
      title: 'حذف البطاقة',
      message: 'هل تريد حذف هذه البطاقة؟',
      type: 'danger'
    });
    if (confirmed) {
      this.http.delete(`https://localhost:7167/api/cards/${cardId}`).subscribe({
        next: () => {
          this.toast.show('تم حذف البطاقة', 'success');
          this.loadCards();
        },
        error: () => this.toast.show('فشل حذف البطاقة', 'error')
      });
    }
  }

  ngOnDestroy() {
    this.hubConnection?.stop();
  }
}