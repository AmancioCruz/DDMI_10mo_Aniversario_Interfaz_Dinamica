    const wrapper = document.getElementById('game-wrapper');
    const canvas  = document.getElementById('game-canvas');
    const ctx     = canvas.getContext('2d');

    function resizeCanvas() {
      canvas.width  = wrapper.clientWidth;
      canvas.height = wrapper.clientHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const BACKGROUNDS = {
      exterior:  'scripts/backgrounds/exterior.jpeg',
      classroom: 'scripts/backgrounds/classroom.jpeg',
    };
    const SPRITES = {
      blender: 'scripts/sprites/Blender.png',
      maya:    'scripts/sprites/maya.svg',
      adobe:   'scripts/sprites/Adobe.png',
    };

    const POSICIONES_FRAC = {
      'izquierda':       .30,
      'centro':          .50,
      'derecha':         .70,
      'izquierda-lejos': .20,
      'derecha-lejos':   .90,
    };

    const imagenesGuardadas = {};
    function cargarImagen(ruta) {
      if (!ruta) return null;
      if (imagenesGuardadas[ruta]) return imagenesGuardadas[ruta];
      const img = new Image();
      img.src = ruta;
      imagenesGuardadas[ruta] = img;
      return img;
    }

    let fondoActual       = null;
    let personajesActivos = [];

    function dibujarFrame() {
      const W = canvas.width, H = canvas.height;
      ctx.clearRect(0, 0, W, H);

      /* fondo */
      if (fondoActual) {
        const imgFondo = cargarImagen(fondoActual);
        if (imgFondo && imgFondo.complete && imgFondo.naturalWidth > 0)
          ctx.drawImage(imgFondo, 0, 0, W, H);
        else {
          ctx.fillStyle = '#1a0d12';
          ctx.fillRect(0, 0, W, H);
        }
      } else {
        ctx.fillStyle = '#1a0d12';
        ctx.fillRect(0, 0, W, H);
      }

      const spriteH = H * .50;
      const spriteW = spriteH * 1;

      for (const personaje of personajesActivos) {
        const imgSprite = cargarImagen(SPRITES[personaje.key]);
        const fx = POSICIONES_FRAC[personaje.pos] ?? .5;
        const x  = fx * W - spriteW / 2;
        const y  = H - spriteH - H * 0.3;
        if (imgSprite && imgSprite.complete && imgSprite.naturalWidth > 0)
          ctx.drawImage(imgSprite, x, y, spriteW, spriteH);
      }

      requestAnimationFrame(dibujarFrame);
    }
    dibujarFrame();

    const GUION = [
      { type:'chapter', label:'Prólogo', title:'Bienvenido al Pipeline' },
      { type:'scene', bg:'exterior', sprites:[] },
      { type:'narration', lines:['Acepté arriesgarlo todo para estudiar diseño.','Las noches sin dormir.','El mercado laboral en decadencia.','Los constantes "¿y de eso vas a vivir?"','Pensé que lo peor ya lo sabía.'] },
      { type:'narration', lines:['Nadie me advirtió sobre ellos…'] },
      { type:'scene', bg:'classroom', sprites:[] },
      { type:'narration', lines:['Llegas a tu salón y tomas asiento.','Todo parece normal por exactamente cinco segundos.'] },
      { type:'scene', bg:'classroom', sprites:[{key:'blender',pos:'centro'}] },
      { type:'dialogue', speaker:'BLENDER', text:'¡Hola! ¿Qué tal? ¡Soy Blender! ¿Quieres una dona? Es gratis. Todo lo que tengo es gratis.' },
      { type:'thought',  text:'Recibes la dona. Es la mejor decisión que tomarás hoy.' },
      { type:'scene', bg:'classroom', sprites:[{key:'blender',pos:'izquierda'},{key:'maya',pos:'derecha'}] },
      { type:'dialogue', speaker:'MAYA',    text:'Ah… tú otra vez.' },
      { type:'dialogue', speaker:'BLENDER', text:'¡Maya! ¿Quieres una dona?' },
      { type:'dialogue', speaker:'MAYA',    text:'No. No acepto archivos .blend. Ya sabes.' },
      { type:'scene', bg:'classroom', sprites:[{key:'blender',pos:'izquierda-lejos'},{key:'maya',pos:'derecha'}] },
      { type:'dialogue', speaker:'MAYA', text:'Autodesk Maya. Modelado de alto rendimiento. Renders de nivel industrial. Pero si tienes que preguntar el precio, no soy para ti.' },
      { type:'narration', lines:['Silencio incómodo. Blender te mira con esa expresión de "lo siento, es así siempre". Tú muerdes la dona.'] },
      { type:'dialogue', speaker:'MAYA', text:'Tarde o temprano tendrás que elegir. Gratis versus estándar de la industria... A menos que quieras quedarte en el 2D.' },
      { type:'narration', lines:['En ese momento, un contrato aparece frente a ti.'] },
      { type:'scene', bg:'classroom', sprites:[{key:'blender',pos:'izquierda-lejos'},{key:'maya',pos:'derecha'},{key:'adobe',pos:'centro'}] },
      { type:'dialogue', speaker:'ADOBE', text:'Plan básico: acceso limitado. Plan Premium: todo lo que necesitas más lo que no sabías que necesitabas. Plan Empresarial: —' },
      { type:'dialogue', speaker:'TÚ',    text:'No te necesito.' },
      { type:'dialogue', speaker:'ADOBE', text:'Aún.' },
      { type:'dialogue', speaker:'ADOBE', text:'Todos terminan cayendo de alguna forma.' },
      { type:'thought', text:'Los miras a los tres. La dona sigue siendo la mejor parte de tu mañana.' },
      { type:'thought', text:'…Debí haber estudiado contabilidad.' },
      { type:'choice', options:[
        { text:'🟠  Acercarte a Blender',  goto:'ruta_blender' },
        { text:'🔵  Hablar con Maya',       goto:'ruta_maya'    },
        { text:'🔴  Ignorar a Adobe',       goto:'ruta_adobe'   },
      ]},
      /* rutas */
      { id:'ruta_blender' },
      { type:'scene', bg:'classroom', sprites:[{key:'blender',pos:'centro'}] },
      { type:'dialogue', speaker:'BLENDER', text:'¡Bien! ¿Empezamos con el donut? Es el tutorial clásico. ¡Hay cuarenta horas de videos!' },
      { type:'thought',  text:'Cuarenta horas. Pero su sonrisa es tan sincera...' },
      { type:'dialogue', speaker:'BLENDER', text:'No te preocupes por el precio. GPL v3. Todo gratis, para siempre. ¡La comunidad lo mantiene!' },
      { type:'narration', lines:['Fin de la ruta Blender. — Capítulo 1: próximamente'] },
      { id:'ruta_maya' },
      { type:'scene', bg:'classroom', sprites:[{key:'maya',pos:'centro'}] },
      { type:'dialogue', speaker:'MAYA', text:'Buena elección. No te arrepentirás. Bueno, la tarjeta de crédito sí lo hará. Pero tú no.' },
      { type:'thought',  text:'Es arrogante. Pero ese rig facial que mostró antes era increíble.' },
      { type:'dialogue', speaker:'MAYA', text:'Hay licencias para estudiantes, por cierto. También puedo ser amable con la gente pobre.' },
      { type:'narration', lines:['Fin de la ruta Maya. — Capítulo 1: próximamente'] },
      { id:'ruta_adobe' },
      { type:'scene', bg:'classroom', sprites:[{key:'adobe',pos:'derecha-lejos'}] },
      { type:'dialogue', speaker:'ADOBE', text:'...' },
      { type:'dialogue', speaker:'ADOBE', text:'¿Me ignoras? Nadie me ignora. Controlo el mercado del diseño.' },
      { type:'thought',  text:'Existe GIMP, Inkscape, Krita, DaVinci Resolve...' },
      { type:'dialogue', speaker:'ADOBE', text:'Eso son nombres de enfermedades raras. De todos modos ya te inscribí en el plan anual, no te vas a deshacer de mí.' },
      { type:'narration', lines:['Fin de la ruta Adobe. — Capítulo 1: próximamente'] },
    ];

    const titleScreen  = document.getElementById('title-screen');
    const chapterCard  = document.getElementById('chapter-card');
    const dialogueBox  = document.getElementById('dialogue-box');
    const speakerName  = document.getElementById('speaker-name');
    const dialogueText = document.getElementById('dialogue-text');
    const thoughtBox   = document.getElementById('thought-box');
    const thoughtText  = document.getElementById('thought-text');
    const narrationBox = document.getElementById('narration-box');
    const narrationText= document.getElementById('narration-text');
    const choiceMenu   = document.getElementById('choice-menu');
    const quitBtn      = document.getElementById('quit-btn');

    const COLORES = { BLENDER:'#e87d3e', MAYA:'#5ec4e0', ADOBE:'#ff3b3b', 'TÚ':'#f2a7bb' };

    let indiceGuion = 0, estaEscribiendo = false, textoCompleto = '', intervalo = null;

    function ocultarTodo() {
      dialogueBox.style.display = thoughtBox.style.display =
      narrationBox.style.display = choiceMenu.style.display = 'none';
    }

    function mostrarTexto(el, texto, cb) {
      estaEscribiendo = true;
      el.textContent = '';
      textoCompleto  = texto;
      let i = 0;
      clearInterval(intervalo);
      intervalo = setInterval(() => {
        el.textContent += texto[i++];
        if (i >= texto.length) { clearInterval(intervalo); estaEscribiendo = false; if(cb) cb(); }
      }, 22);
    }

    function saltarEscritura(el) {
      clearInterval(intervalo);
      el.textContent = textoCompleto;
      estaEscribiendo = false;
    }

    function aplicarEscena(n) {
      if (n.bg)      fondoActual       = BACKGROUNDS[n.bg] || null;
      if (n.sprites) personajesActivos = n.sprites.slice();
    }

    function procesarNodo(n) {
      ocultarTodo();
      if (n.type === 'chapter') {
        document.getElementById('ch-label-text').textContent = n.label;
        document.getElementById('ch-title-text').textContent = n.title;
        chapterCard.style.display = 'flex'; return;
      }
      if (n.type === 'scene')     { aplicarEscena(n); avanzar(); return; }
      if (n.type === 'narration') { narrationBox.style.display='flex'; mostrarTexto(narrationText, n.lines.join('\n')); return; }
      if (n.type === 'dialogue')  {
        dialogueBox.style.display='flex';
        speakerName.textContent = n.speaker||'';
        speakerName.style.color = COLORES[n.speaker]||'var(--rose)';
        mostrarTexto(dialogueText, n.text); return;
      }
      if (n.type === 'thought')   { thoughtBox.style.display='flex'; mostrarTexto(thoughtText, n.text); return; }
      if (n.type === 'choice') {
        choiceMenu.style.display = 'flex';
        choiceMenu.innerHTML = '';
        for (const op of n.options) {
          const btn = document.createElement('button');
          btn.className = 'choice-btn'; btn.textContent = op.text;
          btn.addEventListener('click', () => {
            choiceMenu.style.display = 'none';
            if (op.goto) { const d = GUION.findIndex(x => x.id === op.goto); if(d!==-1){indiceGuion=d; avanzar();} }
            else avanzar();
          });
          choiceMenu.appendChild(btn);
        }
        return;
      }
      if (!n.type) { avanzar(); return; }
    }

    function avanzar() {
      indiceGuion++;
      if (indiceGuion >= GUION.length) { mostrarCreditos(); return; }
      procesarNodo(GUION[indiceGuion]);
    }

    function mostrarCreditos() {
      ocultarTodo(); fondoActual=null; personajesActivos=[];
      narrationBox.style.display='flex';
      narrationText.style.textAlign='center';
      narrationText.innerHTML =
        `<span style="font-size:22px;color:var(--rose);">✦ Rendered Hearts ✦</span>\n\n` +
        `Prólogo completo.\n\n` +
        `<span style="font-size:12px;color:var(--mauve);">Capítulo 1 — próximamente</span>`;
    }

    function manejarAvance() {
      if (estaEscribiendo) {
        for (const caja of [narrationText, dialogueText, thoughtText]) {
          if (caja.parentElement.style.display !== 'none') { saltarEscritura(caja); return; }
        }
      }
      if (choiceMenu.style.display === 'flex') return;
      if (chapterCard.style.display === 'flex') { chapterCard.style.display='none'; avanzar(); return; }
      avanzar();
    }

    document.getElementById('start-btn').addEventListener('click', () => {
      titleScreen.style.display='none'; quitBtn.style.display='flex';
      indiceGuion=-1; avanzar();
    });

    document.getElementById('reiniciar-juego').addEventListener('click', () => {
      clearInterval(intervalo); estaEscribiendo=false;
      ocultarTodo(); chapterCard.style.display='none';
      fondoActual=null; personajesActivos=[]; indiceGuion=-1;
      quitBtn.style.display='none'; titleScreen.style.display='flex';
    });

    quitBtn.addEventListener('click', () => {
      clearInterval(intervalo); estaEscribiendo=false;
      ocultarTodo(); chapterCard.style.display='none';
      fondoActual=null; personajesActivos=[]; indiceGuion=-1;
      quitBtn.style.display='none'; titleScreen.style.display='flex';
    });

    narrationBox.addEventListener('click', manejarAvance);
    dialogueBox.addEventListener ('click', manejarAvance);
    thoughtBox.addEventListener  ('click', manejarAvance);
    chapterCard.addEventListener ('click', manejarAvance);

    document.addEventListener('keydown', e => {
      if (!['Space','Enter','ArrowRight'].includes(e.code)) return;
      if (titleScreen.style.display !== 'none') return;
      manejarAvance();
    });