var version="v1.5.0-beta.2";let editor,entityStates={},stateChanged=!0,lastCall={entityId:null,stateChanged:null,timestamp:null},globalHosts={};class BubblePopUp extends HTMLElement{constructor(){if(super(),!window.eventAdded){const t=history.pushState;window.popUpInitialized=!1,history.pushState=function(){t.apply(history,arguments),window.dispatchEvent(new Event("pushstate"))};const e=history.replaceState;history.replaceState=function(){e.apply(history,arguments),window.dispatchEvent(new Event("replacestate"))},["pushstate","replacestate","click","popstate","mousedown","touchstart"].forEach((t=>{window.addEventListener(t,n)}),{passive:!0});const i=new Event("urlChanged");function n(){const t=window.location.href;t!==this.currentUrl&&(window.dispatchEvent(i),this.currentUrl=t)}const o=()=>{window.dispatchEvent(i),window.addEventListener("popstate",n,{passive:!0})};window.addEventListener("popUpInitialized",o,{passive:!0}),window.eventAdded=!0}}set hass(hass){if(!this.content){this.attachShadow({mode:"open"}),this.shadowRoot.innerHTML='\n <ha-card style="background: none; border: none; box-shadow: none;">\n <div class="card-content" style="padding: 0;">\n </div>\n </ha-card>\n ',this.card=this.shadowRoot.querySelector("ha-card"),this.content=this.shadowRoot.querySelector("div");const t=new Promise((t=>{t(document.querySelector("body > home-assistant").shadowRoot.querySelector("home-assistant-main").shadowRoot.querySelector("ha-drawer > partial-panel-resolver > ha-panel-lovelace").shadowRoot.querySelector("hui-root").shadowRoot.querySelector("div"))}));t.then((t=>{this.editorElement=t}))}let customStyles=this.config.styles?this.config.styles:"",entityId=this.config.entity&&hass.states[this.config.entity]?this.config.entity:"",icon=!this.config.icon&&this.config.entity?hass.states[entityId].attributes.icon||hass.states[entityId].attributes.entity_picture||"":this.config.icon||"",name=this.config.name?this.config.name:this.config.entity?hass.states[entityId].attributes.friendly_name:"",widthDesktop=this.config.width_desktop||"540px",widthDesktopDivided=widthDesktop?widthDesktop.match(/(\d+)(\D+)/):"",shadowOpacity=void 0!==this.config.shadow_opacity?this.config.shadow_opacity:"0",bgBlur=void 0!==this.config.bg_blur?this.config.bg_blur:"10",isSidebarHidden=this.config.is_sidebar_hidden||!1,state=entityId?hass.states[entityId].state:"",stateOn=["on","open","cleaning","true","home","playing"].includes(state)||0!==Number(state)&&!isNaN(Number(state)),formatedState,autoClose=this.config.auto_close||!1,riseAnimation=void 0===this.config.rise_animation||this.config.rise_animation,marginCenter=this.config.margin?"0"!==this.config.margin?this.config.margin:"0px":"7px",popUpHash=this.config.hash,popUpOpen,startTouchY,lastTouchY,triggerEntity=this.config.trigger_entity?this.config.trigger_entity:"",triggerState=this.config.trigger_state?this.config.trigger_state:"",triggerClose=!!this.config.trigger_close&&this.config.trigger_close,stateEntity=this.config.state;function toggleEntity(t){hass.callService("homeassistant","toggle",{entity_id:t})}this.editorElement&&(editor=this.editorElement.classList.contains("edit-mode"));const addStyles=function(context,styles,customStyles,state,entityId,stateChangedVar,path="",element=context.content){const customStylesEval=customStyles?eval("`"+customStyles+"`"):"";let styleAddedKey=styles+"Added";if(!context[styleAddedKey]||context.previousStyle!==customStylesEval||stateChangedVar||context.previousConfig!==context.config){if(!context[styleAddedKey]){if(editor&&!element)return;if(context.styleElement=element.querySelector("style"),!context.styleElement){context.styleElement=document.createElement("style");const t=path?element.querySelector(path):element;t?.appendChild(context.styleElement)}context[styleAddedKey]=!0}context.styleElement.innerHTML!==customStylesEval+styles&&(context.styleElement.innerHTML=customStylesEval+styles),context.previousStyle=customStylesEval,context.previousConfig=context.config}},forwardHaptic=t=>{fireEvent(window,"haptic",t)},navigate=(t,e,i=!1)=>{i?history.replaceState(null,"",e):history.pushState(null,"",e),fireEvent(window,"location-changed",{replace:i})},handleActionConfig=(t,e,i,n)=>{if(!n.confirmation||n.confirmation.exemptions&&n.confirmation.exemptions.some((t=>t.user===e.user.id))||(forwardHaptic("warning"),confirm(n.confirmation.text||`Are you sure you want to ${n.action}?`)))switch(n.action){case"more-info":(this.config.entity||this.config.camera_image)&&fireEvent(t,"hass-more-info",{entityId:this.config.entity?this.config.entity:this.config.camera_image});break;case"navigate":n.navigation_path&&navigate(t,n.navigation_path);break;case"url":n.url_path&&window.open(n.url_path);break;case"toggle":this.config.entity&&(toggleEntity(this.config.entity),forwardHaptic("success"));break;case"call-service":{if(!n.service)return void forwardHaptic("failure");const[t,i]=n.service.split(".",2);e.callService(t,i,n.service_data,n.target),forwardHaptic("success");break}case"fire-dom-event":fireEvent(t,"ll-custom",n)}},handleAction=(t,e,i,n)=>{let o;"double_tap"===n&&this.config.double_tap_action?o=this.config.double_tap_action:"hold"===n&&this.config.hold_action?o=this.config.hold_action:"tap"===n&&this.config.tap_action?o=this.config.tap_action:"double_tap"!==n||this.config.double_tap_action?("hold"!==n||this.config.hold_action)&&("tap"!==n||this.config.tap_action)||(o={action:"more-info"}):o={action:"toggle"},handleActionConfig(t,e,i,o)},addAction=function(){let t,e;return function(i,n,o,a){o.addEventListener(i,(()=>{const n=(new Date).getTime();"click"===i?n-(e||0)<250?(clearTimeout(t),handleAction(a,hass,{},"double_tap")):t=setTimeout((()=>{handleAction(a,hass,{},"tap")}),250):handleAction(a,hass,{},"hold"),e=n}),{passive:!0})}}();function addActions(t,e){addAction("click","tap",e,t),addAction("contextmenu","hold",e,t)}if(entityId){const t=!!hass.states[entityId].attributes&&hass.states[entityId].attributes;this.newPictureUrl=!!t.entity_picture&&t.entity_picture}function createIcon(t,e,i,n,o){updateIcon(t,e,i,n,o)}function updateIcon(t,e,i,n,o){for(;o.firstChild;)o.removeChild(o.firstChild);if(t.newPictureUrl&&!t.config.icon){const e=document.createElement("img");e.setAttribute("src",t.newPictureUrl),e.setAttribute("class","entity-picture"),e.setAttribute("alt","Icon"),o&&o.appendChild(e)}else{const t=document.createElement("ha-icon");t.setAttribute("icon",n),t.setAttribute("class","icon"),o&&o.appendChild(t)}}function isColorCloseToWhite(t){let e=[220,220,190];for(let i=0;i<3;i++)if(t[i]<e[i])return!1;return!0}let haStyle,themeBgColor;haStyle=haStyle||getComputedStyle(document.body),themeBgColor=themeBgColor||haStyle.getPropertyValue("--ha-card-background")||haStyle.getPropertyValue("--card-background-color");let color=this.config.bg_color?this.config.bg_color:themeBgColor,bgOpacity=void 0!==this.config.bg_opacity?this.config.bg_opacity:"88",rgbaColor,oldState;function convertToRGBA(t,e){let i="";if(t.startsWith("#")){i="rgba("+parseInt(t.slice(1,3),16)+", "+parseInt(t.slice(3,5),16)+", "+parseInt(t.slice(5,7),16)+", "+e+")"}else if(t.startsWith("rgb")){let n=t.match(/\d+/g);i="rgba("+n[0]+", "+n[1]+", "+n[2]+", "+e+")"}return i}rgbaColor&&!editor||(rgbaColor=convertToRGBA(color,bgOpacity/100),window.color=color);let currentState=entityId&&stateEntity?hass.states[entityId].state+hass.states[stateEntity].state:entityId?hass.states[entityId].state:stateEntity?hass.states[stateEntity].state:"";if(currentState!==oldState&&(oldState=currentState,stateChanged=!0,setTimeout((()=>{stateChanged=!1}),0)),this.errorTriggered)return;this.initStyleAdded||this.host||editor||(this.card.style.marginTop="4000px",this.initStyleAdded=!0);const createPopUp=()=>{if(this.host){if(!this.popUp&&(this.verticalStack=this.getRootNode(),this.popUp=this.verticalStack.querySelector("#root"),this.verticalStack.contains(this.popUp)&&this.verticalStack.removeChild(this.popUp),!window.popUpInitialized&&this.popUp)){this.config.back_open||!1?localStorage.setItem("backOpen",!0):localStorage.setItem("backOpen",!1);if("true"===localStorage.getItem("backOpen")){window.backOpen=!0;const w=new Event("popUpInitialized");setTimeout((()=>{window.dispatchEvent(w)}),100)}else window.backOpen=!1,popUpOpen=popUpHash+!1,history.replaceState(null,null,location.href.split("#")[0]);window.popUpInitialized=!0}const t=this.popUp,e=this.verticalStack,i=this.config.text||"",n=this.config.state;formatedState=n?hass.formatEntityState(hass.states[n])+" "+i:i;const o=this.config.margin_top_mobile&&"0"!==this.config.margin_top_mobile?this.config.margin_top_mobile:"0px",a=this.config.margin_top_desktop&&"0"!==this.config.margin_top_desktop?this.config.margin_top_desktop:"0px",s=this.config.entity?"flex":"none";let r,l;if(state=n?hass.states[n].state:"",this.headerAdded){if(entityId){const x=this.content.querySelector("#header-container .header-icon"),k=this.content.querySelector("#header-container h2"),$=this.content.querySelector("#header-container p"),C=this.content.querySelector("#header-container .power-button");x.innerHTML="",createIcon(this,hass,entityId,icon,x),k.textContent=name,$.textContent=formatedState,C.setAttribute("style",`display: ${s};`)}}else{const S=document.createElement("div");S.setAttribute("id","header-container");const E=document.createElement("div");S.appendChild(E);const I=document.createElement("div");I.setAttribute("class","header-icon"),E.appendChild(I),createIcon(this,hass,entityId,icon,I),addActions(this,I);const U=document.createElement("h2");U.textContent=name,E.appendChild(U);const O=document.createElement("p");O.textContent=formatedState,E.appendChild(O);const H=document.createElement("ha-icon");H.setAttribute("class","power-button"),H.setAttribute("icon","mdi:power"),H.setAttribute("style",`display: ${s};`),E.appendChild(H);const T=document.createElement("button");T.setAttribute("class","close-pop-up"),T.onclick=function(){history.replaceState(null,null,location.href.split("#")[0]),localStorage.setItem("isManuallyClosed_"+popUpHash,!0)},S.appendChild(T);const A=document.createElement("ha-icon");A.setAttribute("icon","mdi:close"),T.appendChild(A),this.content.appendChild(S),this.header=E,this.headerAdded=!0}function c(){toggleEntity(entityId)}function d(t){"Escape"===t.key&&(popUpOpen=popUpHash+!1,history.replaceState(null,null,location.href.split("#")[0]),localStorage.setItem("isManuallyClosed_"+popUpHash,!0))}function h(t){window.hash===popUpHash&&m(),startTouchY=t.touches[0].clientY,lastTouchY=startTouchY}function p(t){t.touches[0].clientY-startTouchY>300&&t.touches[0].clientY>lastTouchY&&(popUpOpen=popUpHash+!1,history.replaceState(null,null,location.href.split("#")[0]),popUpOpen=popUpHash+!1,localStorage.setItem("isManuallyClosed_"+popUpHash,!0)),lastTouchY=t.touches[0].clientY}if(this.eventAdded||editor||(window["checkHashRef_"+popUpHash]=u,window.addEventListener("urlChanged",window["checkHashRef_"+popUpHash],{passive:!0}),window.addEventListener("click",(function(t){if(location.hash===popUpHash&&m(),!window.justOpened)return;const e=t.composedPath();!e||e.some((t=>"HA-MORE-INFO-DIALOG"===t.nodeName))||e.some((t=>"root"===t.id&&!t.classList.contains("close-pop-up")))||popUpOpen!==popUpHash+!0||(popUpOpen=popUpHash+!1,history.replaceState(null,null,location.href.split("#")[0]),localStorage.setItem("isManuallyClosed_"+popUpHash,!0))}),{passive:!0}),this.eventAdded=!0),entityId){const L=hass.states[entityId].attributes.rgb_color;this.rgbColor=L?isColorCloseToWhite(L)?"rgb(255,220,200)":`rgb(${L})`:stateOn?entityId.startsWith("light.")?"rgba(255,220,200, 0.5)":"var(--accent-color)":"rgba(255, 255, 255, 1",this.rgbColorOpacity=L?isColorCloseToWhite(L)?"rgba(255,220,200, 0.5)":`rgba(${L}, 0.5)`:entityId&&stateOn?entityId.startsWith("light.")?"rgba(255,220,200, 0.5)":"var(--accent-color)":"var(--background-color,var(--secondary-background-color))",l=convertToRGBA(color,0),this.iconFilter=L?isColorCloseToWhite(L)?"none":"brightness(1.1)":"none"}function u(){editor||(window.hash=location.hash.split("?")[0],window.hash===popUpHash?f():t.classList.contains("open-pop-up")&&b())}let g=this.content;function f(){t&&e.appendChild(t),setTimeout((function(){t.classList.remove("close-pop-up"),t.classList.add("open-pop-up"),g.querySelector(".power-button").addEventListener("click",c,{passive:!0}),window.addEventListener("keydown",d,{passive:!0}),t.addEventListener("touchstart",h,{passive:!0}),t.addEventListener("touchmove",p,{passive:!0}),popUpOpen=popUpHash+!0,setTimeout((()=>{window.justOpened=!0}),10),m()}),0)}function b(){t.classList.remove("open-pop-up"),t.classList.add("close-pop-up"),g.querySelector(".power-button").removeEventListener("click",c),window.removeEventListener("keydown",d),t.removeEventListener("touchstart",h),t.removeEventListener("touchmove",p),popUpOpen=popUpHash+!1,window.justOpened=!1,clearTimeout(r),setTimeout((function(){e.contains(t)&&e.removeChild(t)}),320)}function m(){clearTimeout(r),autoClose>0&&(r=setTimeout(_,autoClose))}function _(){history.replaceState(null,null,location.href.split("#")[0])}const y=`\n ha-card {\n margin-top: 0 !important;\n background: none !important;\n border: none !important;\n }\n .card-content {\n width: 100% !important;\n padding: 0 !important;\n }\n #root {\n transition: all 1s !important;\n position: fixed !important;\n margin: 0 -${marginCenter}; /* 7px */\n width: 100%;\n background-color: ${rgbaColor};\n box-shadow: 0px 0px 50px rgba(0,0,0,${shadowOpacity/100});\n backdrop-filter: blur(${bgBlur}px);\n -webkit-backdrop-filter: blur(${bgBlur}px);\n border-radius: 42px;\n box-sizing: border-box;\n top: calc(120% + ${o} + var(--header-height));\n grid-gap: 12px !important;\n gap: 12px !important;\n grid-auto-rows: min-content;\n padding: 18px 18px 220px 18px !important;\n height: 100% !important;\n -ms-overflow-style: none; /* for Internet Explorer, Edge */\n scrollbar-width: none; /* for Firefox */\n overflow-y: auto; \n overflow-x: hidden; \n z-index: 1 !important; /* Higher value hide the more-info panel */\n /* For older Safari but not working with Firefox */\n /* display: grid !important; */ \n }\n #root > bubble-pop-up:first-child::after {\n content: '';\n display: block;\n position: sticky;\n top: 0;\n left: -50px;\n margin: -70px 0 -36px -36px;\n overflow: visible;\n width: 200%;\n height: 100px;\n background: linear-gradient(0deg, ${l} 0%, ${rgbaColor} 80%);\n z-index: 0;\n } \n #root::-webkit-scrollbar {\n display: none; /* for Chrome, Safari, and Opera */\n }\n #root > bubble-pop-up:first-child {\n position: sticky;\n top: 0;\n z-index: 1;\n background: none !important;\n overflow: visible;\n }\n #root.open-pop-up {\n /*will-change: transform;*/\n transform: translateY(-120%);\n transition: transform .4s !important;\n }\n #root.open-pop-up > * {\n /* Block child items to overflow and if they do clip them */\n /*max-width: calc(100vw - 38px);*/\n max-width: 100% !important;\n overflow-x: clip;\n }\n #root.close-pop-up { \n transform: translateY(-20%);\n transition: transform .4s !important;\n box-shadow: none;\n }\n @media only screen and (min-width: 768px) {\n #root {\n top: calc(120% + ${a} + var(--header-height));\n width: calc(${widthDesktop}${"%"!==widthDesktopDivided[2]||isSidebarHidden?"":" - var(--mdc-drawer-width)"}) !important;\n left: calc(50% - ${widthDesktopDivided[1]/2}${widthDesktopDivided[2]});\n margin: 0 !important;\n }\n } \n @media only screen and (min-width: 870px) {\n #root {\n left: calc(50% - ${widthDesktopDivided[1]/2}${widthDesktopDivided[2]} + ${isSidebarHidden?"0px":"var(--mdc-drawer-width) "+("%"===widthDesktopDivided[2]?"":"/ 2")});\n }\n } \n #root.editor {\n position: inherit !important;\n width: 100% !important;\n padding: 18px !important;\n }\n `,v=`\n ha-card {\n margin-top: 0 !important;\n }\n #header-container {\n display: inline-flex;\n ${icon||name||entityId||state||i?"":"flex-direction: row-reverse;"}\n width: 100%;\n margin: 0;\n padding: 0;\n }\n #header-container > div {\n display: ${icon||name||entityId||state||i?"inline-flex":"none"};\n align-items: center;\n position: relative;\n padding: 6px;\n z-index: 1;\n flex-grow: 1;\n background-color: ${entityId?this.rgbColorOpacity:"var(--background-color,var(--secondary-background-color))"};\n transition: background 1s;\n border-radius: 25px;\n margin-right: 14px;\n backdrop-filter: blur(14px);\n -webkit-backdrop-filter: blur(14px);\n }\n .header-icon {\n display: inline-flex;\n width: 38px;\n height: 38px;\n background-color: var(--card-background-color,var(--ha-card-background));\n border-radius: 100%;\n margin: 0 10px 0 0;\n cursor: ${this.config.entity||this.config.double_tap_action||this.config.tap_action||this.config.hold_action?"pointer":"default"}; \n flex-wrap: wrap;\n align-content: center;\n justify-content: center;\n overflow: hidden;\n }\n .header-icon > ha-icon {\n color: ${stateOn?this.rgbColor?this.rgbColor:"var(--accent-color)":"inherit"};\n opacity: ${stateOn?"1":"0.6"};\n filter: ${this.iconFilter};\n }\n .header-icon::after {\n content: '';\n position: absolute;\n width: 38px;\n height: 38px;\n display: block;\n opacity: 0.2;\n transition: background-color 1s;\n border-radius: 50%;\n background-color: ${stateOn?this.rgbColor?this.rgbColor:"var(--accent-color)":"var(--card-background-color,var(--ha-card-background))"};\n }\n .entity-picture {\n height: calc(100% + 16px);\n width: calc(100% + 16px);\n }\n #header-container h2 {\n display: inline-flex;\n margin: 0 18px 0 0;\n /*line-height: 0px;*/\n z-index: 1;\n font-size: 20px;\n }\n #header-container p {\n display: inline-flex;\n line-height: 0px;\n font-size: 16px;\n }\n .power-button {\n cursor: pointer; \n flex-grow: inherit; \n width: 24px;\n height: 24px;\n border-radius: 12px;\n margin: 0 10px;\n background: none !important;\n justify-content: flex-end;\n background-color: var(--background-color,var(--secondary-background-color));\n }\n .close-pop-up {\n height: 50px;\n width: 50px;\n border: none;\n border-radius: 50%;\n z-index: 1;\n background: var(--background-color,var(--secondary-background-color));\n color: var(--primary-text-color);\n flex-shrink: 0;\n cursor: pointer;\n }\n `;if(addStyles(this,y,customStyles,state,entityId,"","",t),addStyles(this,v,customStyles,state,entityId,stateChanged),editor&&!this.editorModeAdded){if(!t)return;e.appendChild(t),t.classList.add("editor"),t.classList.remove("open-pop-up"),t.classList.remove("close-pop-up"),this.editorModeAdded=!0}else!editor&&this.editorModeAdded&&(t.classList.remove("editor"),e.contains(t)&&e.removeChild(t),this.editorModeAdded=!1)}else this.host=this.getRootNode().host};if(this.popUpAdded)!editor&&this.wasEditing&&stateChanged?(createPopUp(),this.wasEditing=!1):(popUpHash===window.hash&&stateChanged||editor&&!this.editorModeAdded)&&(createPopUp(),editor&&(this.wasEditing=!0));else{this.popUpAdded=!0;let t=setInterval((()=>{createPopUp(),this.popUp&&clearInterval(t)}),100);setTimeout((()=>{if(!this.popUp)throw this.errorTriggered=!0,clearInterval(t),new Error("Pop-up card must be placed inside a vertical_stack! If it's already the case, please ignore this error 🍻")}),6e3)}if(this.popUp&&triggerEntity&&stateChanged){null===localStorage.getItem("previousTriggerState_"+popUpHash)&&localStorage.setItem("previousTriggerState_"+popUpHash,""),null===localStorage.getItem("isManuallyClosed_"+popUpHash)&&localStorage.setItem("isManuallyClosed_"+popUpHash,"false"),null===localStorage.getItem("isTriggered_"+popUpHash)&&localStorage.setItem("isTriggered_"+popUpHash,"false");let t=localStorage.getItem("previousTriggerState_"+popUpHash),e="true"===localStorage.getItem("isManuallyClosed_"+popUpHash),i="true"===localStorage.getItem("isTriggered_"+popUpHash);hass.states[triggerEntity].state!==triggerState||null!==t||i||(navigate("",popUpHash),i=!0,localStorage.setItem("isTriggered_"+popUpHash,i)),hass.states[triggerEntity].state!==t&&(e=!1,localStorage.setItem("previousTriggerState_"+popUpHash,hass.states[triggerEntity].state),localStorage.setItem("isManuallyClosed_"+popUpHash,e)),hass.states[triggerEntity].state!==triggerState||e?hass.states[triggerEntity].state!==triggerState&&triggerClose&&this.popUp.classList.contains("open-pop-up")&&i&&!e&&(history.replaceState(null,null,location.href.split("#")[0]),popUpOpen=popUpHash+!1,i=!1,e=!0,localStorage.setItem("isManuallyClosed_"+popUpHash,e),localStorage.setItem("isTriggered_"+popUpHash,i)):(navigate("",popUpHash),i=!0,localStorage.setItem("isTriggered_"+popUpHash,i))}}setConfig(t){if("pop-up"===t.card_type&&!t.hash)throw new Error("You need to define an hash. Please note that this card must be placed inside a vertical_stack to work as a pop-up.");this.config=t}getCardSize(){return 0}static getConfigElement(){return document.createElement("bubble-pop-up-editor")}}let checkElementInterval=setInterval((function(){customElements.define("bubble-pop-up",BubblePopUp),customElements.get("bubble-pop-up")&&clearInterval(checkElementInterval)}),50);console.info(`%c Bubble Card - Pop-up %c ${version} `,"background-color: #555;color: #fff;padding: 3px 2px 3px 3px;border-radius: 14px 0 0 14px;font-family: DejaVu Sans,Verdana,Geneva,sans-serif;text-shadow: 0 1px 0 rgba(1, 1, 1, 0.3)","background-color: #506eac;color: #fff;padding: 3px 3px 3px 2px;border-radius: 0 14px 14px 0;font-family: DejaVu Sans,Verdana,Geneva,sans-serif;text-shadow: 0 1px 0 rgba(1, 1, 1, 0.3)");const fireEvent=(t,e,i,n)=>{n=n||{},i=null==i?{}:i;const o=new Event(e,{bubbles:void 0===n.bubbles||n.bubbles,cancelable:Boolean(n.cancelable),composed:void 0===n.composed||n.composed});return o.detail=i,t.dispatchEvent(o),o};customElements.get("ha-switch");const waitForElement=async()=>{for(;!customElements.get("ha-panel-lovelace");)await new Promise((t=>setTimeout(t,300)));const t=Object.getPrototypeOf(customElements.get("ha-panel-lovelace")),e=t.prototype.html,i=t.prototype.css;customElements.define("bubble-pop-up-editor",class extends t{setConfig(t){this._config={...t}}static get properties(){return{hass:{},_config:{}}}get _entity(){return this._config.entity||""}get _name(){return this._config.name||""}get _icon(){return this._config.icon||""}get _state(){return this._config.state||""}get _text(){return this._config.text||""}get _hash(){return this._config.hash||"#pop-up-name"}get _trigger_entity(){return this._config.trigger_entity||""}get _trigger_state(){return this._config.trigger_state||""}get _trigger_close(){return this._config.trigger_close||!1}get _margin(){return this._config.margin||"7px"}get _margin_top_mobile(){return this._config.margin_top_mobile||"0px"}get _margin_top_desktop(){return this._config.margin_top_desktop||"0px"}get _width_desktop(){return this._config.width_desktop||"540px"}get _bg_color(){return this._config.bg_color||window.color}get _bg_opacity(){return void 0!==this._config.bg_opacity?this._config.bg_opacity:"88"}get _bg_blur(){return void 0!==this._config.bg_blur?this._config.bg_blur:"14"}get _shadow_opacity(){return void 0!==this._config.shadow_opacity?this._config.shadow_opacity:"0"}get _is_sidebar_hidden(){return this._config.is_sidebar_hidden||!1}get _auto_close(){return this._config.auto_close||""}get _back_open(){return this._config.back_open||!1}render(){if(!this.hass)return e``;if(!this.listsUpdated){const t=t=>({label:t,value:t});this.allEntitiesList=Object.keys(this.hass.states).map(t),this.lightList=Object.keys(this.hass.states).filter((t=>"light"===t.substr(0,t.indexOf(".")))).map(t),this.sensorList=Object.keys(this.hass.states).filter((t=>"sensor"===t.substr(0,t.indexOf(".")))).map(t),this.binarySensorList=Object.keys(this.hass.states).filter((t=>"binary_sensor"===t.substr(0,t.indexOf(".")))).map(t),this.coverList=Object.keys(this.hass.states).filter((t=>"cover"===t.substr(0,t.indexOf(".")))).map(t),this.cardTypeList=[{label:"Button",value:"button"},{label:"Cover",value:"cover"},{label:"Empty column",value:"empty-column"},{label:"Horizontal buttons stack",value:"horizontal-buttons-stack"},{label:"Pop-up",value:"pop-up"},{label:"Separator",value:"separator"}],this.buttonTypeList=[{label:"Switch",value:"switch"},{label:"Slider",value:"slider"}],this.listsUpdated=!0}const t=this.allEntitiesList;this.lightList,this.sensorList,this.coverList,this.cardTypeList,this.buttonTypeList;return e` <div class="card-config"> <h3>Pop-up</h3> <ha-alert alert-type="info">This card allows you to convert any vertical stack into a pop-up. Each pop-up can be opened by targeting its link (e.g. '#pop-up-name'), with navigation_path or with the horizontal buttons stack that is included.<br><br><b>It must be placed within a vertical-stack card at the top most position to function properly. The pop-up will be hidden by default until you open it.</b></ha-alert> <ha-textfield label="Hash (e.g. #kitchen)" .value="${this._hash}" .configValue="${"hash"}" @input="${this._valueChanged}" style="width: 100%;" ></ha-textfield> <ha-textfield label="Optional - Name" .value="${this._name}" .configValue="${"name"}" @input="${this._valueChanged}" style="width: 100%;" ></ha-textfield> ${this.makeDropdown("Optional - Icon","icon")} ${this.makeDropdown("Optional - Entity to toggle (e.g. room light group)","entity",t)} ${this.makeDropdown("Optional - Entity state to display (e.g. room temperature)","state",t)} <ha-textfield label="Optional - Additional text" .value="${this._text}" .configValue="${"text"}" @input="${this._valueChanged}" style="width: 100%;" ></ha-textfield> <ha-textfield label="Optional - Auto close in milliseconds (e.g. 15000)" .value="${this._auto_close}" .configValue="${"auto_close"}" @input="${this._valueChanged}" style="width: 100%;" ></ha-textfield> <h3>Pop-up trigger</h3> <ha-alert alert-type="info">This allows you to open this pop-up based on the state of any entity, for example you can open a "Security" pop-up with a camera when a person is in front of your house. You can also create a toggle helper (input_boolean) and trigger its opening/closing in an automation.</ha-alert> ${this.makeDropdown("Optional - Entity to open the pop-up based on its state","trigger_entity",t)} <ha-textfield label="Optional - State to open the pop-up" .value="${this._trigger_state}" .configValue="${"trigger_state"}" @input="${this._valueChanged}" style="width: 100%;" ></ha-textfield> <ha-formfield .label="Optional - Close when the state is different"> <ha-switch aria-label="Optional - Close when the state is different" .checked=${this._trigger_close} .configValue="${"trigger_close"}" @change=${this._valueChanged} ></ha-switch> <div class="mdc-form-field"> <label class="mdc-label">Optional - Close when the state is different</label> </div> </ha-formfield> <h3>Styling options</h3> <ha-textfield label="Optional - Margin (fix centering on some themes) (e.g. 13px)" .value="${this._margin}" .configValue="${"margin"}" @input="${this._valueChanged}" style="width: 100%;" ></ha-textfield> <ha-textfield label="Optional - Top margin on mobile (e.g. -56px if your header is hidden)" .value="${this._margin_top_mobile}" .configValue="${"margin_top_mobile"}" @input="${this._valueChanged}" style="width: 100%;" ></ha-textfield> <ha-textfield label="Optional - Top margin on desktop (e.g. 50% for an half sized pop-up)" .value="${this._margin_top_desktop}" .configValue="${"margin_top_desktop"}" @input="${this._valueChanged}" style="width: 100%;" ></ha-textfield> <ha-textfield label="Optional - Width on desktop (100% by default on mobile)" .value="${this._width_desktop}" .configValue="${"width_desktop"}" @input="${this._valueChanged}" style="width: 100%;" ></ha-textfield> <ha-formfield .label="Optional - Fix when the sidebar is hidden on desktop (turn this to false if your sidebar is unmodified)"> <ha-switch aria-label="Optional - Fix when the sidebar is hidden on desktop (turn this to false if your sidebar is unmodified)" .checked=${this._is_sidebar_hidden} .configValue="${"is_sidebar_hidden"}" @change=${this._valueChanged} ></ha-switch> <div class="mdc-form-field"> <label class="mdc-label">Optional - Fix when the sidebar is hidden on desktop (turn this to false if your sidebar is unmodified)</label> </div> </ha-formfield> <ha-textfield label="Optional - Background color (any hex, rgb or rgba value)" .value="${this._bg_color}" .configValue="${"bg_color"}" @input="${this._valueChanged}" style="width: 100%;" ></ha-textfield> <div style="display: inline-flex;"> <ha-textfield label="Optional - Background opacity" .value="${this._bg_opacity}" .configValue="${"bg_opacity"}" @input="${this._valueChanged}" style="width: 50%;" ></ha-textfield> <ha-slider .value="${this._bg_opacity}" .configValue="${"bg_opacity"}" .min='0' .max='100' @change=${this._valueChanged} style="width: 50%;" ></ha-slider> </div> <div style="display: inline-flex;"> <ha-textfield label="Optional - Background blur" .value="${this._bg_blur}" .configValue="${"bg_blur"}" @input="${this._valueChanged}" style="width: 50%;" ></ha-textfield> <ha-slider .value="${this._bg_blur}" .configValue="${"bg_blur"}" .min='0' .max='100' @change=${this._valueChanged} style="width: 50%;" ></ha-slider> </div> <div style="display: inline-flex;"> <ha-textfield label="Optional - Shadow opacity" .value="${this._shadow_opacity}" .configValue="${"shadow_opacity"}" @input="${this._valueChanged}" style="width: 50%;" ></ha-textfield> <ha-slider .value="${this._shadow_opacity}" .configValue="${"shadow_opacity"}" .min='0' .max='100' @change=${this._valueChanged} style="width: 50%;" ></ha-slider> </div> <ha-alert alert-type="info">You can't set a value to 0 with the sliders for now, just change it to 0 in the text field if you need to.</ha-alert> <h3>Advanced settings</h3> <ha-formfield .label="Optional - Back button/event support"> <ha-switch aria-label="Optional - Back button/event support" .checked=${this._back_open?this._back_open:window.backOpen} .configValue="${"back_open"}" @change=${this._valueChanged} ></ha-switch> <div class="mdc-form-field"> <label class="mdc-label">Optional - Back button/event support</label> </div> </ha-formfield> <ha-alert alert-type="info"><b>Back button/event support</b> : This allow you to navigate through your pop-ups history when you press the back button of your browser. <b>This setting can be applied only once, you don't need to change it in all pop-ups. If it's not working just turn it on for each pop-ups.</b></ha-alert> ${this.makeVersion()} </div> `}makeDropdown(t,i,n){this.hass;return t.includes("icon")||t.includes("Icon")?e` <div> <ha-icon-picker label="${t}" .value="${this["_"+i]}" .configValue="${i}" item-label-path="label" item-value-path="value" @value-changed="${this._valueChanged}" ></ha-icon-picker> </div> `:e` <div> <ha-combo-box label="${t}" .value="${this["_"+i]}" .configValue="${i}" .items="${n}" @value-changed="${this._valueChanged}" ></ha-combo-box> </div> `}makeButton(){let t=[];for(let i=1;i<=this.buttonIndex;i++)t.push(e` <div class="${i}_button"> <div class="button-header"> <ha-icon class="remove-button" icon="mdi:close" @click=${()=>this.removeButton(i)}></ha-icon> <span class="button-number">Button ${i}</span> </div> <ha-textfield label="Link / Hash to pop-up (e.g. #kitchen)" .value="${this._config[i+"_link"]||""}" .configValue="${i}_link" @input="${this._valueChanged}" style="width: 100%;" ></ha-textfield> <ha-textfield label="Optional - Name" .value="${this._config[i+"_name"]||""}" .configValue="${i}_name" @input="${this._valueChanged}" style="width: 100%;" ></ha-textfield> <ha-icon-picker label="Optional - Icon" .value="${this._config[i+"_icon"]||""}" .configValue="${i}_icon" item-label-path="label" item-value-path="value" @value-changed="${this._valueChanged}" ></ha-icon-picker> <ha-combo-box label="Optional - Light / Light group (For background color)" .value="${this._config[i+"_entity"]||""}" .configValue="${i}_entity" .items="${this.allEntitiesList}" @value-changed="${this._valueChanged}" ></ha-combo-box> <ha-combo-box label="Optional - Presence / Occupancy sensor (For button auto order)" .value="${this._config[i+"_pir_sensor"]||""}" .configValue="${i}_pir_sensor" .disabled=${!this._config.auto_order} .items="${this.binarySensorList}" @value-changed="${this._valueChanged}" ></ha-combo-box> </div> `);return t}makeVersion(){return e` <h4>Bubble Card - Pop-up <span style="font-size: 10px;">${version}</span></h4> `}removeButton(t){delete this._config[t+"_name"],delete this._config[t+"_icon"],delete this._config[t+"_link"],delete this._config[t+"_entity"],delete this._config[t+"_pir_sensor"];for(let e=t;e<this.buttonIndex;e++)this._config[e+"_name"]=this._config[e+1+"_name"],this._config[e+"_icon"]=this._config[e+1+"_icon"],this._config[e+"_link"]=this._config[e+1+"_link"],this._config[e+"_entity"]=this._config[e+1+"_entity"],this._config[e+"_pir_sensor"]=this._config[e+1+"_pir_sensor"];delete this._config[this.buttonIndex+"_name"],delete this._config[this.buttonIndex+"_icon"],delete this._config[this.buttonIndex+"_link"],delete this._config[this.buttonIndex+"_entity"],delete this._config[this.buttonIndex+"_pir_sensor"],this.buttonIndex--,fireEvent(this,"config-changed",{config:this._config})}_valueChanged(t){if(!this._config||!this.hass)return;const e=t.target,i=t.detail;e.configValue&&("ha-switch"===e.type?this._config={...this._config,[e.configValue]:e.checked}:this._config={...this._config,[e.configValue]:void 0===e.checked&&i.value?e.checked||i.value:e.value||e.checked}),fireEvent(this,"config-changed",{config:this._config})}static get styles(){return i` div { display: grid; grid-gap: 12px; } #add-button { height: 32px; border-radius: 16px; border: none; background-color: var(--accent-color); } .button-header { height: auto; width: 100%; display: inline-flex; align-items: center; } .button-number { display: inline-flex; width: auto; } .remove-button { display: inline-flex; border-radius: 50%; width: 24px; height: 24px; text-align: center; line-height: 24px; vertical-align: middle; cursor: pointer; } `}})};waitForElement().catch(console.error),window.customCards=window.customCards||[],window.customCards.push({type:"bubble-pop-up",name:"Bubble Pop-up",preview:!1,description:"Just add it in a vertical-stack first."});
