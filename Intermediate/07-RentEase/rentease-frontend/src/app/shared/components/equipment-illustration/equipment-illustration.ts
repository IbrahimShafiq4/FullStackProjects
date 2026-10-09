import { Component, input } from '@angular/core';

export type EquipmentIllustrationName =
  | 'camera' | 'lens' | 'microphone' | 'speaker' | 'headphones'
  | 'drone' | 'gimbal' | 'tripod'
  | 'lighting' | 'projector'
  | 'drill' | 'bicycle' | 'tent';

export function illustrationFor(category: string | null | undefined): EquipmentIllustrationName {
  const c = (category ?? '').toLowerCase();
  if (c.includes('lens')) return 'lens';
  if (c.includes('camera') || c.includes('dslr')) return 'camera';
  if (c.includes('mic')) return 'microphone';
  if (c.includes('audio') || c.includes('sound')) return 'speaker';
  if (c.includes('headphone') || c.includes('monitor')) return 'headphones';
  if (c.includes('drone') || c.includes('aerial')) return 'drone';
  if (c.includes('gimbal') || c.includes('stab')) return 'gimbal';
  if (c.includes('tripod') || c.includes('stand')) return 'tripod';
  if (c.includes('light') || c.includes('led')) return 'lighting';
  if (c.includes('projector') || c.includes('event')) return 'projector';
  if (c.includes('drill') || c.includes('tool') || c.includes('power')) return 'drill';
  if (c.includes('bike') || c.includes('cycl') || c.includes('sport')) return 'bicycle';
  if (c.includes('camp') || c.includes('tent') || c.includes('outdoor')) return 'tent';
  return 'camera';
}

@Component({
  selector: 'app-equipment-illustration',
  template: `
    <svg viewBox="0 0 200 150" fill="none"
      stroke="currentColor"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
      preserveAspectRatio="xMidYMid meet"
      class="w-full h-full"
      aria-hidden="true">
      @switch (name()) {

        @case ('camera') {
          <rect x="50" y="65" width="100" height="65" rx="2"/>
          <path d="M 90 65 L 95 50 L 125 50 L 130 65"/>
          <rect x="58" y="58" width="18" height="7" rx="1"/>
          <circle cx="90" cy="60" r="3"/>
          <circle cx="138" cy="60" r="2.5" fill="currentColor"/>
          <circle cx="100" cy="97" r="26"/>
          <circle cx="100" cy="97" r="18"/>
          <circle cx="100" cy="97" r="9"/>
          <circle cx="100" cy="97" r="3" fill="currentColor"/>
          <line x1="56" y1="75" x2="56" y2="120"/>
          <line x1="62" y1="75" x2="62" y2="120"/>
          <line x1="68" y1="75" x2="68" y2="120"/>
        }

        @case ('lens') {
          <circle cx="100" cy="75" r="48"/>
          <circle cx="100" cy="75" r="42"/>
          <circle cx="100" cy="75" r="28"/>
          <circle cx="100" cy="75" r="14"/>
          <circle cx="100" cy="75" r="3" fill="currentColor"/>
          <line x1="100" y1="27" x2="100" y2="20"/>
          <line x1="100" y1="123" x2="100" y2="130"/>
          <line x1="52" y1="75" x2="45" y2="75"/>
          <line x1="148" y1="75" x2="155" y2="75"/>
          <line x1="138" y1="37" x2="142" y2="33"/>
          <line x1="62" y1="37" x2="58" y2="33"/>
          <line x1="138" y1="113" x2="142" y2="117"/>
          <line x1="62" y1="113" x2="58" y2="117"/>
        }

        @case ('microphone') {
          <rect x="88" y="35" width="24" height="50" rx="4"/>
          <line x1="94" y1="40" x2="94" y2="80" stroke-dasharray="1 3"/>
          <line x1="100" y1="40" x2="100" y2="80" stroke-dasharray="1 3"/>
          <line x1="106" y1="40" x2="106" y2="80" stroke-dasharray="1 3"/>
          <path d="M 82 42 Q 78 60 82 82"/>
          <path d="M 118 42 Q 122 60 118 82"/>
          <rect x="82" y="85" width="36" height="5" rx="1"/>
          <line x1="100" y1="90" x2="100" y2="110"/>
          <line x1="100" y1="110" x2="70" y2="126"/>
          <line x1="100" y1="110" x2="130" y2="126"/>
          <line x1="100" y1="110" x2="100" y2="126"/>
          <line x1="60" y1="130" x2="140" y2="130"/>
        }

        @case ('speaker') {
          <rect x="60" y="30" width="80" height="90" rx="2"/>
          <circle cx="100" cy="58" r="8"/>
          <circle cx="100" cy="58" r="3"/>
          <circle cx="100" cy="98" r="16"/>
          <circle cx="100" cy="98" r="6"/>
          <line x1="70" y1="40" x2="70" y2="112" stroke-dasharray="2 3"/>
          <circle cx="135" cy="115" r="1.5" fill="currentColor"/>
          <circle cx="65" cy="115" r="1.5" fill="currentColor"/>
        }

        @case ('headphones') {
          <path d="M 55 90 Q 55 40 100 40 Q 145 40 145 90"/>
          <rect x="42" y="85" width="22" height="38" rx="6"/>
          <rect x="136" y="85" width="22" height="38" rx="6"/>
          <circle cx="53" cy="104" r="4"/>
          <circle cx="147" cy="104" r="4"/>
          <line x1="100" y1="40" x2="100" y2="34" stroke-dasharray="2 3"/>
        }

        @case ('drone') {
          <rect x="85" y="68" width="30" height="14" rx="2"/>
          <line x1="85" y1="72" x2="48" y2="55"/>
          <line x1="115" y1="72" x2="152" y2="55"/>
          <line x1="85" y1="78" x2="48" y2="95"/>
          <line x1="115" y1="78" x2="152" y2="95"/>
          <circle cx="48" cy="55" r="3"/>
          <circle cx="152" cy="55" r="3"/>
          <circle cx="48" cy="95" r="3"/>
          <circle cx="152" cy="95" r="3"/>
          <ellipse cx="48" cy="55" rx="18" ry="3"/>
          <ellipse cx="152" cy="55" rx="18" ry="3"/>
          <ellipse cx="48" cy="95" rx="18" ry="3"/>
          <ellipse cx="152" cy="95" rx="18" ry="3"/>
          <circle cx="100" cy="90" r="6"/>
          <circle cx="100" cy="90" r="2" fill="currentColor"/>
        }

        @case ('gimbal') {
          <rect x="88" y="95" width="24" height="40" rx="3"/>
          <circle cx="100" cy="95" r="6"/>
          <line x1="100" y1="89" x2="100" y2="55"/>
          <line x1="100" y1="55" x2="130" y2="55"/>
          <line x1="130" y1="55" x2="130" y2="72"/>
          <rect x="118" y="72" width="24" height="16" rx="1"/>
          <circle cx="130" cy="80" r="5"/>
          <circle cx="130" cy="80" r="2" fill="currentColor"/>
        }

        @case ('tripod') {
          <rect x="80" y="38" width="40" height="8" rx="1"/>
          <line x1="90" y1="30" x2="90" y2="38"/>
          <circle cx="90" cy="29" r="2" fill="currentColor"/>
          <line x1="100" y1="46" x2="100" y2="80"/>
          <line x1="100" y1="80" x2="62" y2="128"/>
          <line x1="100" y1="80" x2="138" y2="128"/>
          <line x1="100" y1="80" x2="100" y2="128"/>
          <line x1="55" y1="130" x2="69" y2="130"/>
          <line x1="93" y1="130" x2="107" y2="130"/>
          <line x1="131" y1="130" x2="145" y2="130"/>
        }

        @case ('lighting') {
          <rect x="55" y="40" width="90" height="55" rx="2"/>
          <line x1="77" y1="40" x2="77" y2="95"/>
          <line x1="100" y1="40" x2="100" y2="95"/>
          <line x1="123" y1="40" x2="123" y2="95"/>
          <line x1="55" y1="58" x2="145" y2="58"/>
          <line x1="55" y1="77" x2="145" y2="77"/>
          <path d="M 50 50 Q 42 68 50 85"/>
          <path d="M 150 50 Q 158 68 150 85"/>
          <line x1="100" y1="95" x2="100" y2="122"/>
          <line x1="82" y1="126" x2="118" y2="126"/>
        }

        @case ('projector') {
          <rect x="45" y="60" width="110" height="50" rx="3"/>
          <circle cx="68" cy="85" r="14"/>
          <circle cx="68" cy="85" r="6" fill="currentColor"/>
          <line x1="100" y1="70" x2="142" y2="70" stroke-dasharray="2 3"/>
          <line x1="100" y1="78" x2="142" y2="78" stroke-dasharray="2 3"/>
          <line x1="100" y1="86" x2="142" y2="86" stroke-dasharray="2 3"/>
          <line x1="100" y1="94" x2="142" y2="94" stroke-dasharray="2 3"/>
          <line x1="85" y1="110" x2="85" y2="124"/>
          <line x1="115" y1="110" x2="115" y2="124"/>
          <line x1="75" y1="126" x2="125" y2="126"/>
        }

        @case ('drill') {
          <path d="M 55 60 L 130 60 L 130 92 L 92 92 L 82 128 L 62 128 Z"/>
          <rect x="130" y="66" width="16" height="20" rx="1"/>
          <line x1="142" y1="66" x2="142" y2="86"/>
          <line x1="136" y1="66" x2="136" y2="86"/>
          <line x1="146" y1="76" x2="154" y2="76"/>
          <path d="M 88 92 L 82 104 L 92 104"/>
          <line x1="66" y1="72" x2="118" y2="72" stroke-dasharray="2 3"/>
          <line x1="66" y1="82" x2="118" y2="82" stroke-dasharray="2 3"/>
        }

        @case ('bicycle') {
          <circle cx="55" cy="105" r="26"/>
          <circle cx="145" cy="105" r="26"/>
          <line x1="55" y1="79" x2="55" y2="131"/>
          <line x1="29" y1="105" x2="81" y2="105"/>
          <line x1="145" y1="79" x2="145" y2="131"/>
          <line x1="119" y1="105" x2="171" y2="105"/>
          <line x1="55" y1="105" x2="90" y2="65"/>
          <line x1="90" y1="65" x2="145" y2="105"/>
          <line x1="90" y1="65" x2="130" y2="65"/>
          <line x1="130" y1="65" x2="145" y2="105"/>
          <line x1="82" y1="60" x2="100" y2="60"/>
          <line x1="90" y1="65" x2="82" y2="60"/>
          <line x1="128" y1="55" x2="128" y2="65"/>
          <line x1="118" y1="55" x2="138" y2="55"/>
          <circle cx="90" cy="105" r="5"/>
        }

        @case ('tent') {
          <line x1="18" y1="122" x2="182" y2="122"/>
          <path d="M 42 122 L 100 38 L 158 122"/>
          <path d="M 70 122 L 100 75 L 130 122"/>
          <line x1="100" y1="38" x2="100" y2="20"/>
          <line x1="100" y1="38" x2="28" y2="120"/>
          <line x1="100" y1="38" x2="172" y2="120"/>
          <line x1="70" y1="122" x2="70" y2="128"/>
          <line x1="130" y1="122" x2="130" y2="128"/>
        }
      }
    </svg>
  `,
})
export class EquipmentIllustration {
  name = input.required<EquipmentIllustrationName>();
}