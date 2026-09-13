import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastContainer } from './shared/components/toast-container/toast-container';
import { DynamicPopup } from './shared/components/dynamic-popup/dynamic-popup';
import { Header } from './shared/components/header/header';
import { Footer } from './shared/components/footer/footer';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Footer, ToastContainer, DynamicPopup],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App { }