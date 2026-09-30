import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
  signal,
} from '@angular/core';

const EMOJIS = {
  'Smileys': [
    '😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰',
    '😘', '😗', '😙', '😚', '😋', '😛', '😝', '😜', '🤪', '🤨', '🧐', '🤓', '😎', '🤩', '🥳', '😏',
    '😒', '😞', '😔', '😟', '😕', '🙁', '😣', '😖', '😫', '😩', '🥺', '😢', '😭', '😤', '😠', '😡',
    '🤬', '🤯', '😳', '🥵', '🥶', '😱', '😨', '😰', '😥', '😓', '🤗', '🤔', '🤭', '🤫', '🤥', '😶',
    '😐', '😑', '😬', '🙄', '😯', '😦', '😧', '😮', '😲', '🥱', '😴', '🤤', '😪', '😵', '🤐', '🥴',
    '🤢', '🤮', '🤧', '😷', '🤒', '🤕',
  ],
  'Gestures': [
    '👍', '👎', '👌', '🤌', '🤏', '✌️', '🤞', '🤟', '🤘', '🤙', '👈', '👉', '👆', '👇', '☝️', '✋',
    '🤚', '🖐️', '🖖', '👋', '🤝', '🙏', '✍️', '💅', '🤳', '💪', '🦾', '🦵', '🦶', '👂', '🦻', '👃',
    '🧠', '🦷', '🦴', '👀', '👁️', '👅', '👄',
  ],
  'Hearts': [
    '❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '❣️', '💕', '💞', '💓', '💗', '💖',
    '💘', '💝', '💟', '♥️', '💌', '💋', '💑', '💏', '🌹', '🌸', '🌺', '🌻', '🌷', '🌼', '✨', '⭐',
    '🌟', '💫', '🔥', '💯', '🎉', '🎊', '🎁', '🎈',
  ],
  'Objects': [
    '📎', '📌', '📍', '📁', '📂', '📅', '📆', '📝', '✏️', '🖊️', '🖋️', '📖', '📚', '📕', '📗', '📘',
    '📙', '📓', '📔', '📒', '📄', '📃', '📑', '📊', '📈', '📉', '💼', '🎒', '👓', '🕶️', '💡', '🔔',
    '⏰', '⏳', '⌛', '🕐', '📱', '💻', '⌨️', '🖥️', '🖨️', '🖱️', '🎧', '🎤', '🎵', '🎶', '🔊', '📻',
  ],
} as const;

type Category = keyof typeof EMOJIS;

@Component({
  selector: 'app-emoji-picker',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="picker" (click)="$event.stopPropagation()">
      <div class="picker__tabs" role="tablist">
        @for (cat of categories; track cat) {
          <button
            type="button"
            role="tab"
            class="picker__tab"
            [class.picker__tab--active]="active() === cat"
            [attr.aria-selected]="active() === cat"
            (click)="active.set(cat)">
            {{ cat }}
          </button>
        }
      </div>

      <div class="picker__grid" role="listbox">
        @for (emoji of emojis[active()]; track emoji) {
          <button
            type="button"
            class="picker__emoji"
            role="option"
            [attr.aria-label]="emoji"
            (click)="pick.emit(emoji)">
            {{ emoji }}
          </button>
        }
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      position: absolute;
      bottom: calc(100% + 8px);
      right: 0;
      z-index: 50;
      animation: pop-in 220ms cubic-bezier(.22,1,.36,1) both;
    }

    @keyframes pop-in {
      from { opacity: 0; transform: translateY(6px) scale(0.97); }
      to   { opacity: 1; transform: translateY(0) scale(1); }
    }

    .picker {
      width: 320px;
      max-width: calc(100vw - 32px);
      background: var(--surface);
      border-radius: var(--r-md);
      box-shadow: var(--shadow-lg);
      border: 1px solid var(--line);
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }

    .picker__tabs {
      display: flex;
      gap: 2px;
      padding: 6px 6px 0;
      border-bottom: 1px solid var(--line);
      overflow-x: auto;
      scrollbar-width: none;
    }

    .picker__tabs::-webkit-scrollbar { display: none; }

    .picker__tab {
      padding: 8px 10px;
      font-size: 12px;
      font-weight: 600;
      color: var(--muted);
      border-radius: var(--r-sm) var(--r-sm) 0 0;
      cursor: pointer;
      transition: background-color 140ms ease, color 140ms ease;
      border-bottom: 2px solid transparent;
      white-space: nowrap;
    }

    .picker__tab:hover { color: var(--ink); }

    .picker__tab--active {
      color: var(--teal-dark);
      border-bottom-color: var(--teal);
    }

    .picker__grid {
      display: grid;
      grid-template-columns: repeat(8, 1fr);
      gap: 2px;
      padding: 8px;
      overflow-y: auto;
      max-height: 240px;
      overscroll-behavior: contain;
    }

    .picker__emoji {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      aspect-ratio: 1;
      font-size: 20px;
      line-height: 1;
      border-radius: var(--r-sm);
      cursor: pointer;
      transition: background-color 120ms ease, transform 120ms ease;
    }

    .picker__emoji:hover { background: var(--surface-2); }
    .picker__emoji:active { transform: scale(0.9); }
  `],
})
export class EmojiPickerComponent {
  @Output() pick = new EventEmitter<string>();

  readonly categories: Category[] = ['Smileys', 'Gestures', 'Hearts', 'Objects'];
  readonly active = signal<Category>('Smileys');
  readonly emojis = EMOJIS;
}