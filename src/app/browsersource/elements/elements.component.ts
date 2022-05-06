import { animate, animateChild, group, query, style, transition, trigger } from '@angular/animations'
import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs'
import { OBSService } from 'src/app/shared/obs.service'
import { AlertsService } from '../../shared/alerts.service'

export enum POSITION {
  TOP_LEFT = 'TOP_LEFT',
  TOP = 'TOP',
  TOP_RIGHT = 'TOP_RIGHT',
  LEFT = 'LEFT',
  CENTER = 'CENTER',
  RIGHT = 'RIGHT',
  BOTTOM_LEFT = 'BOTTOM_LEFT',
  BOTTOM = 'BOTTOM',
  BOTTOM_RIGHT = 'BOTTOM_RIGHT',
  MANUAL = 'Manual XY'
}

export const BORDER ={
  types: {
    squared: 'Squared',
    rounded: 'Rounded',
    roundedMore: 'Rounded More', 
    ellipse: 'Ellipse', 
  },
  thickness: {
    thinner: 'Thinner',
    thin: 'Thin',
    regular: 'Regular',
    thick: 'Thick',
    thicker: 'Thicker',
    thiccboi: 'Thiccboi',
  },
  color: {
    black: 'Black',
    white: 'White',
    transparent: 'Transparent',
    rainbow: 'Rainbow',
    vaporwave: 'Vaporwave',
    custom: 'Custom',
  }
}


export enum TRANSITION {
  NONE = 'None',
  FADE = 'Fade',
  EXPAND = 'Expand',
  EXPAND_HOR = 'Expand Horizontally',
  EXPAND_VER = 'Expand Vertically',
  POP_UP = 'Pop upwards',
  POP_DOWN = 'Pop downwards',
  UNPOP_UP = 'Unpop upwards',
  UNPOP_DOWN = 'Unpop downwards',
  SWIPE_LEFT = 'Swipe left',
  SWIPE_RIGHT = 'Swipe right',
}

export const ELEMENT_ANIMATIONS_IN = [
  trigger('in', [

    transition('void => loading', []),

    transition(`loading => FADE`, [
      style({opacity: 0}),
      animate('500ms ease', style({}))
    ]),
   
    transition(`loading => POP_UP`, [
      style({opacity: 0, transform: 'translateX(-10px) translateY(30px)'}),
      animate('500ms ease', style({}))
    ]),
    transition(`loading => POP_DOWN`, [
      style({opacity: 0, transform: 'translateX(-10px) translateY(-30px)'}),
      animate('500ms ease', style({}))
    ]),

    transition(`loading => UNPOP_UP`, [
      style({opacity: 0, transform: 'translateX(10px) translateY(30px)'}),
      animate('500ms ease', style({}))
    ]),

    transition(`loading => UNPOP_DOWN`, [
      style({opacity: 0, transform: 'translateX(10px) translateY(-30px)'}),
      animate('500ms ease', style({}))
    ]),

    transition(`loading => SWIPE_RIGHT`, [
      style({opacity: 0, transform: 'rotate(90deg) translateX(-2000px)'}),
      animate('500ms ease', style({}))
    ]),
    transition(`loading => SWIPE_LEFT`, [
      style({opacity: 0, transform: 'rotate(-90deg) translateX(2000px)'}),
      animate('500ms ease', style({}))
    ]),
    transition(`:enter`, [
      group([
        query('@*', [
          animateChild(),
        ]),
      ])
    ])
  ])
]
export const ELEMENT_ANIMATIONS_IN_INNER = [
  trigger('innerIN', [

    transition(`loading => EXPAND`, [
      style({opacity: 0, transform: 'scale(0)'}),
      animate('500ms ease', style({}))
    ]),
    transition(`loading => EXPAND_HOR`, [
      style({opacity: 0, transform: 'scaleX(0)'}),
      animate('500ms ease', style({}))
    ]),
    transition(`loading => EXPAND_VER`, [
      style({opacity: 0, transform: 'scaleY(0)'}),
      animate('500ms ease', style({}))
    ]),

  ])
]

export const ELEMENT_ANIMATIONS_OUT = [
  trigger('out', [

    transition('FADE => void', [
      style({}),
      animate('500ms ease', style({opacity: 0})),
    ]),

    transition('POP_DOWN => void', [
      style({}),
      animate('500ms ease', style({opacity: 0, transform: 'translateX(10px) translateY(30px)'})),
    ]),
    transition('POP_UP => void', [
      style({}),
      animate('500ms ease', style({opacity: 0, transform: 'translateX(10px) translateY(-30px)'})),
    ]),

    transition('UNPOP_UP => void', [
      style({}),
      animate('500ms ease', style({opacity: 0, transform: 'translateX(-10px) translateY(-30px)'})),
    ]),

    transition('UNPOP_DOWN => void', [
      style({}),
      animate('500ms ease', style({opacity: 0, transform: 'translateX(-10px) translateY(30px)'})),
    ]),

    transition('SWIPE_LEFT => void', [
      style({}),
      animate('500ms ease', style({opacity: 0, transform: 'rotate(90deg) translateX(-2000px)'})),
    ]),
    transition('SWIPE_RIGHT => void', [
      style({}),
      animate('500ms ease', style({opacity: 0, transform: 'rotate(-90deg) translateX(2000px)'})),
    ]),
    transition(`:leave`, [
      group([
        query('@*', [
          animateChild(),
        ]),
      ])
    ])
  ])
]
export const ELEMENT_ANIMATIONS_OUT_INNER = [
  trigger('innerOUT', [

    transition(`EXPAND => void`, [
      style({}),
      animate('500ms ease', style({opacity: 0, transform: 'scale(0)'}))
    ]),
    transition(`EXPAND_HOR => void`, [
      style({}),
      animate('500ms ease', style({opacity: 0, transform: 'scaleX(0)'}))
    ]),
    transition(`EXPAND_VER => void`, [
      style({}),
      animate('500ms ease', style({opacity: 0, transform: 'scaleY(0)'}))
    ]),

  ])
]

@Component({
  selector: 'app-elements',
  templateUrl: './elements.component.html',
  animations: [...ELEMENT_ANIMATIONS_IN, ...ELEMENT_ANIMATIONS_OUT]
})
export class ElementsComponent implements OnInit {

  viewport = {
    width: 1920,
    height: 1080,
    padding: 50
  }

  currentElements: any[] = []

  
  constructor(private alerts: AlertsService, public OBS: OBSService) {
    alerts.elementsSubject.subscribe(element => {
      switch (element.what) {
        case 'start':
          if(/EXPAND/.test(element.transitionIN)) {
            element.innerTransitionIN = element.transitionIN
            //delete element.transitionIN
          }
          if(/EXPAND/.test(element.transitionOUT)) {
            element.innerTransitionOUT = element.transitionOUT
            //delete element.transitionOUT
          }
          this.currentElements.push(element)
          break
        case 'ended': 
          this.currentElements.splice(this.currentElements.indexOf(element.element), 1)
          break
      }
    })
  }

  cantPlay = false
  async ngOnInit() {
    if(!this.OBS.isOBS) {
      let audio = new Audio()
      audio.play().catch(e => {
        this.cantPlay = true
        window.onclick = (click) => {
          this.cantPlay = false
          window.onclick = null
        }
      })
    }
  }

  public static elementViewportStyle(viewport, element, outerStyle?): any {
    let style: any = {}
    style.width = (+viewport.width - (+viewport.padding*2))+'px'
    style.height =(+viewport.height - (+viewport.padding*2))+'px'

    if(element.position) {

      if(/MANUAL/.test(element.position)) {
        //TODO HANDLE MANUAL POSITIONING
        try {
          let _width = parseInt(outerStyle.width.replace('px', ''))
          let _height = parseInt(outerStyle.height.replace('px', ''))
          console.log(`Outer: ${_width} by ${_height}`)

          let _targetX = +element.targetX
          let _targetY = +element.targetY

          style.paddingLeft = `${_targetX - _width/2 - (element.ignorePadding ? +viewport.padding : 0)}px`
          style.paddingTop = `${_targetY - _height/2 - (element.ignorePadding ? +viewport.padding : 0)}px`
        } catch(e) { }
        
      } else {
        style.display = 'flex'
        style.alignItems = 'center'
        style.justifyContent = 'center' 
      }

      if(/TOP/.test(element.position)) {
        style.alignItems = 'flex-start'
      } else if(/BOTTOM/.test(element.position)) {
        style.alignItems = 'flex-end'
      } 

      if(/LEFT/.test(element.position)) {
        style.justifyContent = 'flex-start'
      } else if(/RIGHT/.test(element.position)) {
        style.justifyContent = 'flex-end'
      } 

    } else {
      console.log('flexing')
      style.display = 'flex'
      style.alignItems = 'center'
      style.justifyContent = 'center' 
    }

    outerStyle.marginLeft = `${element.offsetX}px`
    outerStyle.marginTop = `${element.offsetY}px`
    
    return style
  }
}