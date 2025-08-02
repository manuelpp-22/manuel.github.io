document.addEventListener('DOMContentLoaded', () => {
    // --- ELEMENTOS GLOBALES Y PLAYLIST ---
    const bgMusic = document.getElementById('bgMusic');
    const mainContainer = document.querySelector('main.container');
    const musicControlsContainer = document.getElementById('musicControlsContainer');
    const musicControlBtn = document.getElementById('musicControl');
    const volumeSlider = document.getElementById('volumeSlider');

    // Aquí defines la banda sonora de tu experiencia.
    const playlist = [
        'TikTok_Hit_-_I_Wanna_Be_Yours_Sped_Up_Version__CeeNaija.com_.mp3',
        'Love_Maze.mp3',
        'mockingbird.mp3',
        'snowma.mp3',
        'enamorado tuyo.mp3',
        'mykind.mp3',
        
        

        

        
    ];
    let currentTrackIndex = 0;

    // --- SISTEMA DE REPRODUCCIÓN CONTINUA ---
    const playTrack = (index) => {
        if (index >= playlist.length) {
            index = 0; // Vuelve al inicio de la playlist al terminar.
        }
        currentTrackIndex = index;
        bgMusic.src = playlist[currentTrackIndex];
        bgMusic.load();
        return bgMusic.play(); // Devuelve la promesa para manejarla después.
    };

    // --- FUNCIÓN PARA CAMBIAR DE CANCIÓN CON CROSSFADE ---
    const crossfadeToTrack = (newTrackIndex) => {
        // No hacer nada si es la misma canción o la música no está inicializada.
        if (currentTrackIndex === newTrackIndex || !bgMusic) return;

        const currentVolume = bgMusic.volume;
        // 1. Bajar el volumen de la canción actual.
        gsap.to(bgMusic, {
            duration: 1.5,
            volume: 0,
            ease: 'linear',
            onComplete: () => {
                // 2. Cuando el volumen es 0, cambiar a la nueva canción y subir el volumen.
                playTrack(newTrackIndex).then(() => {
                    gsap.to(bgMusic, { duration: 2.0, volume: currentVolume, ease: 'linear' });
                });
            }
        });
    };


    // --- CARGADOR DINÁMICO DE PÁGINAS (SIN INTERRUMPIR LA MÚSICA) ---
    const loadPageContent = async (url) => {
        // 1. Desvanecer el contenido actual. La música sigue sonando.
        await gsap.to(mainContainer, { duration: 0.6, opacity: 0, ease: 'power2.in' });


        try {
            // 2. Cargar el HTML de la nueva página en segundo plano.
            const response = await fetch(url);
            if (!response.ok) throw new Error(`Failed to load page: ${response.statusText}`);
            const text = await response.text();

            // 3. Extraer las partes que necesitamos del nuevo HTML.
            const parser = new DOMParser();
            const doc = parser.parseFromString(text, 'text/html');
            const newContentHTML = doc.querySelector('main.container').innerHTML;
            const newBodyClass = doc.body.className;

            // 4. Actualizar el contenido y el estilo de la página actual.
            mainContainer.innerHTML = newContentHTML;
            document.body.className = newBodyClass;
            
            // 5. Animar la entrada del nuevo contenido.
            gsap.to(mainContainer, { duration: 0.6, opacity: 1, ease: 'power2.out' });

            // 6. Ejecutar el código específico para la nueva "página".
            runPageInitializer(newBodyClass);

        } catch (error) {
            console.error("Error loading page content:", error);
            mainContainer.innerHTML = `<div class="content-box"><p>¡Ups! Algo salió mal al cargar la siguiente sorpresa. Por favor, intenta refrescar la página.</p></div>`;
        }
    };

    // --- INICIALIZADORES DE CADA PÁGINA ---
    const runPageInitializer = (pageClass) => {
        if (pageClass.includes('page-bts')) initBtsPage();
        if (pageClass.includes('page-letters')) initLettersPage();
        if (pageClass.includes('page-finale')) initFinalePage();
        if (pageClass.includes('page-bouquet')) initBouquetPage();
    };

    const initBtsPage = () => {
        gsap.fromTo('.content-box', 
            { opacity: 0, y: 30, scale: 0.95 }, 
            { duration: 1.2, opacity: 1, y: 0, scale: 1, ease: 'back.out(1.4)', stagger: 0.2 }
        );
        const link = document.getElementById('navigateToLetters');
        link.addEventListener('click', (e) => {
            e.preventDefault();
            loadPageContent(link.href);
        });
    };

    const initLettersPage = () => {
        const letters = [
    "Para la chica que no solo ilumina mis días, sino que también da sentido a mis noches...",
    "Tu presencia llegó como un suspiro al alma… y desde entonces, todo es más bonito contigo.",
    "Amo verte vibrar con cada canción de BTS... tu emoción se vuelve mi emoción, y tu brillo mi escenario favorito.",
    "Contigo, cada día es mi propio 'Magic Shop', un refugio donde el amor y la paz se abrazan.",
    "Agradezco al destino por cruzar nuestros caminos de la forma más hermosa.",
    "Tu sonrisa tiene esa magia que convierte un ‘Spring Day’ helado en el abrazo más cálido del universo.",
    "Prometo ser tu refugio en los días grises, tu mejor amigo en los días comunes, y tu fan número uno… todos los días.",
    "Amo nuestras noches de películas, esas charlas que se hacen eternas… y tu forma única de mirar la vida, como si fuera un arte.",
    "Eres más brillante que cualquier ‘Dynamite’... y no hay noche que no explote de amor cuando pienso en ti.",
    "Entre risas, silencios y sueños, hemos creado un mundo que solo existe para nosotros."
        ];
        let currentLetterIndex = 0;
        const letterTextEl = document.getElementById('letterText');
        const letterCounterEl = document.getElementById('letterCounter');
        const nextBtn = document.getElementById('nextBtn');
        const prevBtn = document.getElementById('prevBtn');
        const flipCard = document.querySelector('.flip-card');

        const showLetter = (index) => {
            // 1. Voltea la carta a su estado inicial (si estaba volteada)
            if (flipCard.classList.contains('is-flipped')) {
                flipCard.classList.remove('is-flipped');
            }

            // 2. Actualiza el texto en el reverso de la carta
            letterTextEl.textContent = letters[index];
            letterCounterEl.textContent = `${index + 1} / ${letters.length}`;

            // 3. Habilita/deshabilita los botones de navegación
            prevBtn.style.opacity = index === 0 ? '0.5' : '1';
            prevBtn.disabled = index === 0;
            nextBtn.textContent = (index === letters.length - 1) ? 'Ver la sorpresa final' : 'Siguiente';
        };

        // Añade el evento para voltear la carta al hacer clic
        flipCard.addEventListener('click', () => {
            flipCard.classList.toggle('is-flipped');
        });

        nextBtn.addEventListener('click', () => {
            if (currentLetterIndex < letters.length - 1) {
                currentLetterIndex++;
                showLetter(currentLetterIndex);
            } else {
                loadPageContent('finale.html');
            }
        });

        prevBtn.addEventListener('click', () => {
            if (currentLetterIndex > 0) {
                currentLetterIndex--;
                showLetter(currentLetterIndex);
            }
        });

        showLetter(0);
        gsap.fromTo('.letter-carousel', 
            { opacity: 0, y: 30, scale: 0.95 }, 
            { duration: 1.2, opacity: 1, y: 0, scale: 1, ease: 'back.out(1.4)' }
        );
    };

    const initFinalePage = () => {
        // FIX: Dinámicamente creamos el contenedor del cielo estrellado si no existe.
        // Esto soluciona el error que impedía que el resto de la página se cargara.
        let starrySky = document.querySelector('.starry-sky');
        if (!starrySky) {
            starrySky = document.createElement('div');
            starrySky.className = 'starry-sky';
            document.body.prepend(starrySky); // Se añade al inicio del body para que quede detrás.
        }

        const stars = [];
        for (let i = 0; i < 150; i++) {
            const star = document.createElement('div');
            star.className = 'star';
            const size = Math.random() * 3 + 1;
            star.style.width = `${size}px`;
            star.style.height = star.style.width;
            star.style.top = `${Math.random() * 100}%`;
            star.style.left = `${Math.random() * 100}%`;
            star.style.animationDelay = `${Math.random() * 2}s`;
            star.dataset.depth = Math.random() * 0.5 + 0.2;
            starrySky.appendChild(star);
            stars.push(star);
        }

        const handleMouseMove = (event) => {
            const { clientX, clientY } = event;
            const { innerWidth, innerHeight } = window;
            const moveX = (clientX / innerWidth - 0.5) * 2;
            const moveY = (clientY / innerHeight - 0.5) * 2;
            stars.forEach(star => {
                if (!star) return; // Seguridad por si el elemento ya no existe
                const depth = star.dataset.depth;
                gsap.to(star, { x: -moveX * 25 * depth, y: -moveY * 25 * depth, duration: 1, ease: 'power2.out' });
            });
        };
        window.addEventListener('mousemove', handleMouseMove);

        const finalMessage = "Tú eres mi universo";
        const titleEl = document.querySelector('.page-finale .title');
        gsap.fromTo('.final-message', 
            { opacity: 0, y: 20, scale: 0.9 }, 
            { duration: 1.2, opacity: 1, y: 0, scale: 1, ease: 'power3.out' }
        );
        gsap.to(titleEl, {
            duration: 4,
            text: finalMessage,
            ease: "none",
            delay: 1.5,
            onComplete: () => {
                // Después de un momento, cargamos la sorpresa final del ramo.
                setTimeout(() => {
                    // Limpieza: removemos el listener y el cielo estrellado para la siguiente página.
                    window.removeEventListener('mousemove', handleMouseMove);
                    const sky = document.querySelector('.starry-sky');
                    if (sky) {
                        gsap.to(sky, {
                            duration: 0.6,
                            opacity: 0,
                            onComplete: () => sky.remove()
                        });
                    }
                    loadPageContent('diadelanovia.html'); 
                }, 2500); // 2.5 segundos para leer el mensaje.
            }
        });
    };  
    const startFloatingWords = () => {
        // FIX: Si el contenedor no existe, lo creamos dinámicamente y corregimos la redeclaración.
        let wordsContainer = document.getElementById('floatingWordsContainer');
        if (!wordsContainer) {
            wordsContainer = document.createElement('div');
            wordsContainer.id = 'floatingWordsContainer';
            document.body.prepend(wordsContainer); // Lo añadimos detrás de todo el contenido.
        }

        if (!wordsContainer) return;

        // Limpiamos por si se reinicia la animación en algún momento
        wordsContainer.innerHTML = '';

        const words = ["Te amo", "Mi princesa", "Siempre tú", "Mi amor", "Para siempre", "Mi niña bonita", "Contigo", "💜", "Mi todo", "Tú y yo", "Mi sol", "Mi cielo", "Amor eterno", "Ternura pura", "Solo tú", "Mi razón", "Eres magia", "Mi hogar", "Juntos", "Tú me completas", "Mi alegría", "Mi mundo", "Nuestro amor", "Mi corazón", "Tú vales todo", "Dulzura", "Eres luz", "Mi chiquita", "Mi angelito", "Amor de mi vida", "💖", "Eres mi canción", "Locamente tuyo", "Mi inspiración", "Mi locura linda"
];
        const wordCount = 12; // Número de palabras flotando a la vez

        for (let i = 0; i < wordCount; i++) {
            const wordEl = document.createElement('span');
            wordEl.className = 'floating-word';
            wordEl.textContent = words[Math.floor(Math.random() * words.length)];
            
            // Estilos aleatorios para un efecto más orgánico
            wordEl.style.left = `${Math.random() * 95}%`;
            wordEl.style.fontSize = `${Math.random() * 1.5 + 1.2}rem`; // ej: 1.2rem a 2.7rem
            wordEl.style.animationDelay = `${Math.random() * 20}s`;
            wordEl.style.animationDuration = `${Math.random() * 15 + 20}s`; // Duración entre 20s y 35s
            wordsContainer.appendChild(wordEl);
        }
    }; 
    
    const initBouquetPage = () => {
        // 1. Animar la entrada del título y el botón especial.
        gsap.fromTo(['.page-bouquet .title', '#drawBouquetBtn'], 
            { opacity: 0, y: 20, scale: 0.95 }, 
            { duration: 1, opacity: 1, y: 0, scale: 1, ease: 'back.out(1.4)', stagger: 0.3 }
        );
    
        const bouquetContainer = document.getElementById('bouquet-container');
        const drawBtn = document.getElementById('drawBouquetBtn');
        const finalSubtitle = document.querySelector('.final-bouquet-subtitle');

        // Limpieza: Nos aseguramos de que no haya un contenedor de palabras de una ejecución anterior.
        const existingContainer = document.getElementById('floatingWordsContainer');
        if (existingContainer) {
            existingContainer.remove();
        }
    
        if (!bouquetContainer || !drawBtn || !finalSubtitle) return;
    
        // 2. Esperar a que se haga clic en el botón.
        drawBtn.addEventListener('click', () => {
            // ¡Aquí ocurre la magia! Cambiamos a la canción alegre.
            // El índice 4 corresponde a la 5ta canción en la playlist.
            crossfadeToTrack(4);
            // ¡NUEVO! Iniciar la animación de palabras flotantes.
            startFloatingWords();
            // ¡NUEVO! Animación de fondo suave que cambia de color.
            gsap.to('body.page-bouquet', {
                duration: 20, // Duración larga para un cambio sutil
                backgroundColor: '#d9b8f1', // Color lavanda de la paleta
                ease: 'sine.inOut',
                yoyo: true, // Va y vuelve al color original
                repeat: -1 // Se repite indefinidamente
            });

            // 3. Ocultar el botón con una animación.
            gsap.to(drawBtn, { duration: 0.5, opacity: 0, scale: 0.8, ease: 'power2.in', onComplete: () => drawBtn.style.display = 'none' });
    
            // 4. ¡Comienza la magia! Dibujar el ramo.
            const numberOfTulips = 25; // Número de tulipanes en el ramo
            // Paleta de colores más vibrante y con sombras para dar profundidad
            const colors = [
                { main: '#ff7eb9', shadow: '#ff4f9a' }, // Rosa brillante
                { main: '#ff6b6b', shadow: '#ee3e3e' }, // Rojo coral
                { main: '#feca57', shadow: '#f9b42d' }, // Amarillo azafrán
                { main: '#48dbfb', shadow: '#0abde3' }, // Azul claro
                { main: '#9b59b6', shadow: '#8e44ad' }, // Púrpura amatista
                { main: '#ff9a8b', shadow: '#f76d5a' }, // Melocotón
            ];

            // Organizamos los tulipanes en un arco para un look más natural
            const arcAngle = 90; // Un arco más cerrado para un ramo más compacto
            const baseHeight = 20; // Aumenta la variación de altura
    
    
            for (let i = 0; i < numberOfTulips; i++) {
                const tulip = document.createElement('div');
                tulip.classList.add('tulip');
                const colorPair = colors[Math.floor(Math.random() * colors.length)];
                
                // Damos más profundidad con z-index y escala
                const progress = i / (numberOfTulips - 1);
                // Los del centro (progress=0.5) estarán más al frente
                const zIndex = Math.floor(10 + (1 - Math.abs(progress - 0.5) * 2) * 10);
                tulip.style.zIndex = zIndex;

                // Hacemos los tulipanes de los bordes ligeramente más pequeños para dar perspectiva
                const scale = 1 - Math.abs(progress - 0.5) * 0.4 + (Math.random() - 0.5) * 0.1;

   
                // SVG del tulipán mejorado: más detallado y con hojas
              
                tulip.innerHTML = `
                   <svg viewBox="0 0 100 200" class="tulip-svg">
                        <path class="stem" d="M 50,200 Q 48,160 50,100" stroke="#38761d" stroke-width="4" fill="none" />
                        <path class="leaf" d="M 50,170 C 20,170 30,120 50,140 C 70,120 80,170 50,170 Z" fill="#4caf50" />
                        <g class="flower">
                            <path d="M 50,105 C 20,100 25,55 50,40 C 75,55 80,100 50,105 Z" fill="${colorPair.main}" />
                            <path d="M 50,105 C 35,100 35,70 50,55 C 65,70 65,100 50,105 Z" fill="${colorPair.shadow}" />
                        </g>
                    </svg>
                `;
                bouquetContainer.appendChild(tulip);
    
               // Posicionamos cada tulipán en el arco
               const rotation = (progress - 0.5) * arcAngle;
               const translationY = baseHeight * Math.random(); // Pequeña variación de altura
               
               // Seleccionamos los elementos del SVG para animarlos
               const stem = tulip.querySelector('.stem');
               const flower = tulip.querySelector('.flower');
               const leaf = tulip.querySelector('.leaf');

               // Preparamos la animación de crecimiento
               const stemLength = stem.getTotalLength();
               gsap.set(stem, { strokeDasharray: stemLength, strokeDashoffset: stemLength });
               gsap.set([flower, leaf], { opacity: 0, scale: 0, transformOrigin: 'bottom center' });
               
               // Aplicamos la rotación y posición inicial
               gsap.set(tulip, {
                   transform: `translateX(-50%) rotate(${rotation}deg) translateY(-${translationY}px) scale(${scale})`,
                   opacity: 0
               });

               // Creamos la línea de tiempo de la animación para cada tulipán
               const tl = gsap.timeline({ delay: 0.5 + i * 0.08 });
               tl.to(tulip, { opacity: 1, duration: 0.2 })
                 .to(stem, { strokeDashoffset: 0, duration: 0.8, ease: 'power2.out' })
                 .to([flower, leaf], { opacity: 1, scale: 1, duration: 0.6, ease: 'back.out(1.7)' }, "-=0.4");
            }

            // ¡NUEVO! Añadimos un envoltorio para el ramo
            const wrapper = document.createElement('div');
            wrapper.className = 'bouquet-wrapper';
            bouquetContainer.appendChild(wrapper);
            gsap.from(wrapper, {
                scaleY: 0,
                opacity: 0,
                transformOrigin: 'bottom center',
                ease: 'power2.out',
                delay: 0.5, // Aparece al inicio de la animación del ramo
                duration: 1
            });

            const bow = document.createElement('div');
            bow.innerHTML = '🎀';
            bow.className = 'bouquet-bow';
            bouquetContainer.appendChild(bow);
            gsap.from(bow, { scale: 0, opacity: 0, ease: 'elastic.out(1, 0.5)', delay: 0.5 + numberOfTulips * 0.08, duration: 1.5 });
    
            // 5. Mostrar el subtítulo final cuando el ramo esté casi completo.
            const finalDelay = 0.5 + (numberOfTulips * 0.08);
            gsap.to(finalSubtitle, {
                duration: 1,
                opacity: 1,
                y: 0,
                ease: 'power3.out',
                delay: finalDelay
            });

            const restartBtn = document.getElementById('restartBtn');
            if (restartBtn) {
                gsap.to(restartBtn, { duration: 1, opacity: 1, y: 0, ease: 'power3.out', delay: finalDelay + 0.5 });
                restartBtn.addEventListener('click', () => {
                    gsap.to(mainContainer, { duration: 0.7, opacity: 0, scale: 0.9, ease: 'power2.in', onComplete: () => window.location.href = '/' });
                });
            }
        }, { once: true }); // El listener se ejecuta solo una vez.
    };


    // --- LÓGICA DE LA PÁGINA INICIAL (PUNTO DE PARTIDA) ---
    const pageClass = document.body.className;
    if (pageClass.includes('page-login')) {
        const welcomeOverlay = document.getElementById('welcomeOverlay');
        const loginBox = document.querySelector('.login-box');
        gsap.set(loginBox, { opacity: 0 });

        const startExperience = () => {
            gsap.to(welcomeOverlay, {
                duration: 1, opacity: 0, ease: 'power2.inOut',
                onComplete: () => { welcomeOverlay.style.display = 'none'; }
            });

            if (bgMusic) {
                bgMusic.volume = 0;
                playTrack(currentTrackIndex).then(() => {
                    gsap.to(bgMusic, {
                        duration: 4,
                        volume: 0.7,
                        ease: 'linear',
                        onUpdate: () => {
                            if (volumeSlider) volumeSlider.value = bgMusic.volume * 100;
                        }
                    });
                     // Hacemos visible el contenedor de controles de música
                     if (musicControlsContainer) {
                        musicControlsContainer.classList.add('visible');
                    }
                }).catch(error => console.log("Error al iniciar audio:", error));

                // Cuando una canción termine, pasa a la siguiente.
                bgMusic.addEventListener('ended', () => {
                    playTrack(currentTrackIndex + 1);
                });
            }
            gsap.fromTo('.login-box', 
                { opacity: 0, y: 30, scale: 0.95 }, 
                { duration: 1.2, opacity: 1, y: 0, scale: 1, ease: 'back.out(1.4)', stagger: 0.2 }
            );
        };

        welcomeOverlay.addEventListener('click', startExperience, { once: true });

        const loginForm = document.getElementById('loginForm');
        const loginErrorEl = document.getElementById('loginError');

        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // --- VALIDACIÓN DE LA CLAVE SECRETA ---
            // ¡IMPORTANTE! Cambia estos valores por los correctos.
            const correctName = "Mi niña";
            const correctPassword = "I.W.B.Y"; // Reemplaza "1234" con la clave mágica.

            const enteredName = document.getElementById('name').value;
            const enteredPassword = document.getElementById('password').value;

            // Limpiamos el mensaje de error anterior
            if (loginErrorEl) loginErrorEl.textContent = '';

            // Comparamos los valores (ignorando mayúsculas/minúsculas en el nombre para evitar errores)
            if (enteredName.trim().toLowerCase() === correctName.trim().toLowerCase() && enteredPassword.trim() === correctPassword.trim()) {
                // Si es correcto, cargamos la siguiente página.
                loadPageContent('bts-world.html');
            } else {
                // Si es incorrecto, mostramos un mensaje de error elegante.
                if (loginErrorEl) loginErrorEl.textContent = 'El nombre o la clave mágica no son correctos. ❤️';
                // Animación de "sacudida" para indicar el error
                gsap.fromTo(loginBox, { x: 0 }, { duration: 0.6, x: 10, ease: 'elastic.out(1, 0.3)', yoyo: true, repeat: 1 });
                document.getElementById('password').value = '';
                document.getElementById('password').focus();
            }
        });
        // --- CONTROL DE MÚSICA (PLAY/PAUSE) ---
    if (musicControlBtn) {
        musicControlBtn.addEventListener('click', () => {
            if (bgMusic.paused) {
                bgMusic.play();
                musicControlBtn.classList.remove('paused');
                musicControlBtn.setAttribute('aria-label', 'Pausar música');
            } else {
                bgMusic.pause();
                musicControlBtn.classList.add('paused');
                musicControlBtn.setAttribute('aria-label', 'Reanudar música');
            }
        });
    }
    }
     // --- CONTROL DE VOLUMEN ---
     if (volumeSlider) {
        volumeSlider.addEventListener('input', (e) => {
            const newVolume = e.target.value / 100;
            bgMusic.volume = newVolume;
        });
    }
 // --- EFECTO DE CORAZONES AL HACER CLIC (GLOBAL) ---
 const createClickBurst = (x, y) => {
    const heartCount = 7;
    const colors = ['#f8c5d8', '#d9b8f1', '#ffdde1', '#ee9ca7', '#fff1eb'];

    for (let i = 0; i < heartCount; i++) {
        const heart = document.createElement('div');
        heart.classList.add('click-heart');
        const color = colors[Math.floor(Math.random() * colors.length)];
        heart.style.backgroundColor = color;
        document.body.appendChild(heart);

        // Animación con GSAP para un efecto de explosión suave
        gsap.fromTo(heart, {
            left: x,
            top: y,
            scale: 0.5,
            opacity: 1,
        }, {
            duration: 0.8 + Math.random() * 0.5,
            left: x + (Math.random() - 0.5) * 100, // Dispersión horizontal
            top: y + (Math.random() - 0.5) * 100,  // Dispersión vertical
            scale: 0,
            opacity: 0,
            ease: 'power2.out',
            onComplete: () => heart.remove() // Limpieza automática del DOM
        });
    }
};

document.addEventListener('click', (e) => {
    // Evita que el efecto se active en botones, links, inputs, etc.
    if (e.target.closest('button, a, input, .flip-card, .tulip')) return;
    createClickBurst(e.clientX, e.clientY);
});
});



