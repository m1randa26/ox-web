# OX Residencial — Informe de referencia para réplica

> Fuente analizada: https://www.oxresidencial.com/ (revisado el 18-nov-2026).
> Método: descarga del HTML renderizado, la hoja CSS compilada y los chunks JS; inspección de estilos computados en navegador a 1024, 1440 y 375 px.
> Este documento es la **fuente de verdad** para reconstruir el sitio de forma idéntica.
>
> **Decisión del proyecto (18-nov-2026):** la réplica se construye con **Astro 6 + Tailwind v4, sin Framer Motion**; las animaciones van en CSS puro con un mínimo de JS. Las secciones 1 a 10 describen el sitio **original** (Next.js); la sección 11 describe **cómo está hecha la réplica**.

---

## 1. Resumen técnico (sitio original)

| Aspecto | Valor |
|---|---|
| Tipo | **Landing page de una sola página** (one‑page). No hay rutas internas: `/robots.txt`, `/sitemap.xml`, `/aviso-de-privacidad` → 404 |
| Framework | **Next.js (App Router, React Server Components, Turbopack)** |
| Estilos | **Tailwind CSS v4** (`@layer theme/base/components/utilities`, `color-mix(in oklab, …)`, `@property --tw-*`) |
| Animación | **Framer Motion** (`motion.div`, `whileInView`, `AnimatePresence`, `useReducedMotion`) |
| Íconos | **lucide-react** (stroke 2, `currentColor`) + SVG propios para Instagram, Facebook y WhatsApp |
| Imágenes | `next/image` (`/_next/image?url=…&w=…&q=75`), formato fuente **.webp** |
| Fuentes | `next/font/google`: **Outfit** (display) + **Inter** (texto) |
| Hosting | **Vercel** (`Server: Vercel`, `X-Vercel-Cache`) |
| Idioma | `<html lang="es" class="… h-full">`, `og:locale = es_MX` |
| Backend | `POST /api/contacto` (JSON) para el formulario |
| Contacto | WhatsApp `+52 999 650 0077` (`wa.me/5219996500077`) |

---

## 2. Tipografía

### Familias
| Rol | Fuente | Pesos cargados | Variable CSS | Uso |
|---|---|---|---|---|
| Display / títulos | **Outfit** (Google Fonts) | 300, 400, 500, 600, 700 | `--font-outfit` → `--font-display` | h1, h2, h3, cifras de fichas, frases destacadas, wordmark del footer, títulos de columnas del footer |
| Texto / UI | **Inter** (Google Fonts) | 400, 500, 600 (+700) | `--font-inter` → `--font-sans` (default) | Cuerpo, navegación, botones, etiquetas, formularios |

- Fallbacks: `"Outfit Fallback"` (Arial con `size-adjust:99.82%`, `ascent-override:100.18%`, `descent-override:26.05%`) y `"Inter Fallback"`; luego `ui-sans-serif, system-ui, sans-serif`.
- `font-display: swap`. Subsets: latin + latin-ext (Inter también cyrillic, greek, vietnamese).
- `body`: `-webkit-font-smoothing: antialiased; text-rendering: optimizeLegibility;` + clase `antialiased`.
- Utilidad custom **`.tracking-display { letter-spacing: -0.02em }`** (todos los títulos Outfit).

Implementación en la réplica (Astro): fuentes self-hosted con **Fontsource** (`@fontsource/outfit` 300–700, `@fontsource/inter` 400–700) importadas en `src/styles/global.css`, más los dos `@font-face` de fallback con las mismas métricas que genera `next/font`:
```css
@font-face{font-family:"Outfit Fallback";src:local(Arial);ascent-override:100.18%;descent-override:26.05%;line-gap-override:0%;size-adjust:99.82%}
@font-face{font-family:"Inter Fallback";src:local(Arial);ascent-override:90.44%;descent-override:22.52%;line-gap-override:0%;size-adjust:107.12%}
:root{--font-outfit:"Outfit","Outfit Fallback";--font-inter:"Inter","Inter Fallback"}
```

### Escala tipográfica (valores computados)
| Elemento | Fuente | Tamaño móvil → desktop | Peso | Interlineado | Tracking |
|---|---|---|---|---|---|
| H1 hero | Outfit | 36px (`text-4xl`) → 60px `sm`/`lg` (`text-6xl`) → 72px `xl` (`text-7xl`) | 600 | `1.05` | −0.02em |
| H2 sección | Outfit | 30px (`text-3xl`) → 36px `sm` → **44px** `lg` (`text-[2.75rem]`) | 600 | 1.25 (`leading-tight`) | −0.02em |
| H2 contacto | Outfit | 30px fijo | 600 | 1.25 | −0.02em |
| H3 "Distribución" | Outfit | 24px → 30px `sm` | 600 | 1.25 | −0.02em |
| H3 tarjetas | Outfit | 20px (`text-xl`) | 500 | — | normal |
| Cifra en ficha | Outfit | 18px (`text-lg`) | 600 | 1.25 | normal |
| Frase destacada (cita) | Outfit | 24px (`text-2xl`) | **300** | 1.375 (`snug`) | normal |
| Frase ubicación | Outfit | 18px | 300 | 1.375 | normal |
| Eyebrow (sobre‑título) | Inter | 14px → 16px `sm` (o 12px fijo en algunas) | 500 | — | **0.3em**, MAYÚSCULAS |
| Ubicación hero | Inter | 18px → 20px | 500 | — | — |
| Párrafo intro sección | Inter | 18px (`text-lg`) | 400 | 1.625 (`relaxed`) | — |
| Párrafo hero | Inter | 16px → 18px | 400 | 1.625 | — |
| Cuerpo / tarjetas | Inter | 14px (`text-sm`) | 400 | 1.625 | — |
| Nav | Inter | 14px | 500 | — | — |
| Botones | Inter | 14px | 500 | — | `tracking-wide` (0.025em) |
| Chips hero | Inter | 12px | 500 | — | — |
| Footer legal | Inter | 12px | 400 | — | — |

---

## 3. Paleta de colores

Variables definidas en `:root` (fuera de capas) y expuestas a Tailwind como colores `marfil`, `greige`, etc.:

| Token | HEX | RGB | Uso principal |
|---|---|---|---|
| `--marfil` | **#F6F3EE** | 246,243,238 | Fondo del `body`, texto sobre oscuro, botones claros |
| `--greige` | **#B7B1A5** | 183,177,165 | Bordes (global), divisores |
| `--chukum` | **#C7B299** | 199,178,153 | Definido pero **no usado** en el HTML actual |
| `--carbon` | **#2E2E2E** | 46,46,46 | Fondo sección Smart Living, texto secundario en claro |
| `--grafito` | **#1C1C1C** | 28,28,28 | Texto principal, fondo footer, overlays |
| `--verde` | **#1E3A34** | 30,58,52 | Color de marca: CTAs, sección OSTECH, íconos check |
| `--verde-700` | **#16302B** | 22,48,43 | Hover de CTAs verdes |
| `--oro` | **#B8915A** | 184,145,90 | Acentos: eyebrows, línea decorativa, asteriscos, íconos fichas, chip de precio, focus ring |
| `--oro-300` | **#D6B483** | 214,180,131 | Acento sobre fondos oscuros, hover de botones claros |
| WhatsApp | **#25D366** | — | Botón flotante |
| Error | `red-500 #FB2C36` / `red-600 #E40014` | — | Validación del formulario |

Opacidades usadas (Tailwind `/NN` → `color-mix(in oklab, var(--x) NN%, transparent)`):
- marfil: /10 /15 /30 /45 /50 /55 /60 /70 /75 /80 /85 /90 /95
- carbon: /40 (placeholder) /55 /60 /65 /75 /80 /85
- grafito: /0 /25 /30 /40 /75 /80 /90
- greige: /20 /30 /40 /60 · verde: /10 /50 · oro: /10 /30 /50 · white: /30 /40 /60

### ⚠️ Peculiaridad CRÍTICA de bordes
El CSS global (sin capa, por lo tanto **gana sobre las utilidades de Tailwind**) define:
```css
* { border-color: var(--greige); }
@supports (color: color-mix(in lab, red, red)) {
  * { border-color: color-mix(in srgb, var(--greige) 45%, transparent); }
}
```
Consecuencia: **todos los bordes se ven greige al 45 %** aunque el markup diga `border-marfil/10`, `border-oro/30`, `border-verde`, etc. (verificado: las tarjetas oscuras de Smart Living computan `rgba(183,177,165,.45)`). Para un resultado idéntico hay que replicar esta regla tal cual (no dentro de `@layer`).

### Sistema de fondos por sección
`marfil` (hero bajo video) → **carbon** (Smart Living) → **marfil** (Hogar) → **white/30 sobre marfil** (Ubicación) → **verde** (OSTECH) → **white/30** (Contacto) → **grafito** (Footer).

---

## 4. CSS global (copiar literal)

```css
:root{
  --marfil:#f6f3ee; --greige:#b7b1a5; --chukum:#c7b299; --carbon:#2e2e2e;
  --grafito:#1c1c1c; --verde:#1e3a34; --verde-700:#16302b; --oro:#b8915a; --oro-300:#d6b483;
}
*{border-color:var(--greige)}
@supports (color:color-mix(in lab, red, red)){*{border-color:color-mix(in srgb, var(--greige) 45%, transparent)}}
html{scroll-behavior:smooth;scroll-padding-top:8rem}
body{background:var(--marfil);color:var(--grafito);font-family:var(--font-sans), ui-sans-serif, system-ui, sans-serif;-webkit-font-smoothing:antialiased;text-rendering:optimizelegibility}
.font-display{font-family:var(--font-display), ui-sans-serif, system-ui, sans-serif}
.rule-oro{background:linear-gradient(90deg, transparent, var(--oro) 20%, var(--oro) 80%, transparent);height:1px} /* definida, no usada */
.tracking-display{letter-spacing:-.02em}
@media (prefers-reduced-motion:reduce){html{scroll-behavior:auto}*,:before,:after{transition-duration:.001ms!important;animation-duration:.001ms!important}}
:focus-visible{outline:2px solid var(--oro);outline-offset:2px;border-radius:2px}
```

Tema Tailwind v4 (`@theme inline`) equivalente:
```css
@import "tailwindcss";
@theme inline {
  --color-background: var(--marfil);
  --color-marfil: var(--marfil); --color-greige: var(--greige); --color-chukum: var(--chukum);
  --color-carbon: var(--carbon); --color-grafito: var(--grafito);
  --color-verde: var(--verde); --color-verde-700: var(--verde-700);
  --color-oro: var(--oro); --color-oro-300: var(--oro-300);
  --font-sans: var(--font-inter); --font-display: var(--font-outfit);
  --radius-xl: 1rem;      /* ⚠️ personalizado (default TW = 0.75rem) */
  --radius-2xl: 1.5rem;   /* ⚠️ personalizado (default TW = 1rem) */
  --radius-3xl: 1.5rem;
}
```
> Nota: en el CSS compilado `rounded-xl = 1rem`, `rounded-2xl = 1.5rem` y `rounded-3xl = 1.5rem` (2xl y 3xl son iguales).

### Breakpoints (Tailwind por defecto)
`sm 640px` · `md 768px` · `lg 1024px` · `xl 1280px` · `2xl 1536px`. También `@media (hover:hover)` para estados hover.

### Contenedor
Todas las secciones: `mx-auto max-w-7xl (1280px) px-5 (20px) sm:px-8 (32px)`.

### Sombras (Tailwind default)
`shadow-sm`, `shadow-md`, `shadow-lg`, `shadow-xl`, más `shadow-black/20` en CTA hero y botón WhatsApp.

---

## 5. Estructura del sitio (orden exacto)

```
<header> fijo
<main>
  #inicio        Hero con video
  #smart-living  Smart Living (fondo carbon)
  #hogar         Conoce tu nuevo hogar (galería, fichas, plano)
  #ubicacion     Ubicación + Google Maps
  #ostech        OSTECH Desarrolladora (fondo verde)
  #contacto      Formulario "Agenda tu visita"
</main>
<footer>
Botón flotante WhatsApp
```

### Patrón "Eyebrow" (sobre‑título reutilizado)
```html
<p class="flex items-center gap-3 text-sm font-medium uppercase tracking-[0.3em] text-oro sm:text-base">
  <span class="h-px w-8 bg-oro"></span>Smart Living
</p>
```
Línea horizontal de 32×1px + texto en mayúsculas espaciado. Variantes: `text-xs` fijo (Distribución, OSTECH, Contacto), `justify-center` (Distribución), `text-oro-300`/`bg-oro-300` sobre verde (OSTECH).

### Patrón "SectionHeading"
`div.max-w-2xl` → eyebrow → `h2.mt-4 font-display text-3xl font-semibold leading-tight tracking-display sm:text-4xl lg:text-[2.75rem]` (color `text-marfil` en oscuro / `text-grafito` en claro) → `p.mt-5 text-lg leading-relaxed` (`text-marfil/70` o `text-carbon/75`).

### Patrón de botones (Button)
Base: `inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full px-7 text-sm font-medium tracking-wide transition-all duration-200`
- **Primario verde**: `bg-verde text-marfil hover:bg-verde-700 shadow-sm hover:shadow-md`
- **Claro**: `bg-marfil text-grafito hover:bg-oro-300`
- **CTA hero**: `min-h-[52px] px-8 shadow-lg shadow-black/20 hover:shadow-xl`
- **Header**: `min-h-[44px] px-5`, sin tracking, `transition-colors`
- Todos los CTA abren WhatsApp en pestaña nueva (`target="_blank" rel="noopener noreferrer"`).

---

## 6. Detalle por sección

### 6.1 Header (fijo)
- `header.fixed inset-x-0 top-0 z-40 transition-all duration-300`
  - **Arriba (scrollY ≤ 24)**: `bg-transparent`, links `text-marfil/90 hover:text-marfil`, botón hamburguesa `text-marfil`.
  - **Con scroll (scrollY > 24)**: `border-b border-greige/30 bg-marfil/85 backdrop-blur-md`, links `text-carbon/80 hover:text-verde`, hamburguesa `text-carbon`.
- Contenedor: `max-w-7xl px-5 py-3 sm:px-8 flex items-center justify-between`.
- **Logo**: `/logo-ox.png` (1150×704, PNG con transparencia) → `h-28` (112px) móvil / `sm:h-32` (128px), `w-auto object-contain`, `priority`. Enlaza a `#inicio`. Alto real del header: ~137px móvil / ~153px desktop.
  - El logo es el monograma "OX": la **O** formada por 3 trazos curvos concéntricos en verde oscuro con brillo, y la **X** con un trazo dorado degradado (oro claro → oro) y otro trazo verde. Sin texto.
- **Nav desktop** (`hidden lg:flex gap-8`, `text-sm font-medium whitespace-nowrap`): Smart Living (`#smart-living`) · Tu Nuevo Hogar (`#hogar`) · Ubicación (`#ubicacion`) · OSTECH Desarrolladora (`#ostech`).
- **Botón "Conoce OX"** (`hidden sm:inline-flex`, verde, rounded-full).
- **Hamburguesa** (`lg:hidden`, 44×44, `rounded-full`, ícono lucide `menu`/`x` 24px). `aria-label` alterna "Abrir menú"/"Cerrar menú".
- **Menú móvil** (desplegado bajo el header): `nav.border-t border-greige/30 bg-marfil/95 backdrop-blur-md lg:hidden`; links `border-b border-greige/20 py-3 text-base font-medium text-carbon last:border-0`, cierran el menú al click; al final botón verde `mt-3 min-h-[48px] … "Agenda una visita"`.
- `html { scroll-padding-top: 8rem }` compensa el header fijo en los anclajes.

### 6.2 Hero `#inicio`
- `section.relative flex min-h-[100svh] items-end overflow-hidden`.
- **Video de fondo**: `/media/video-ox-cortado.mp4` (~38.6 MB), `autoplay muted loop playsInline preload="metadata"`, `poster="/renders/fachada-principal.webp"`, `absolute inset-0 object-cover`. JS: si `currentTime >= 50` vuelve a 0 (loop de 50 s).
- **Overlay**: `bg-gradient-to-t from-grafito/75 via-grafito/25 to-transparent`.
- Contenido: `relative z-10 max-w-7xl px-5 pb-16 pt-32 sm:px-8 sm:pb-20` → `div.max-w-2xl lg:max-w-4xl xl:max-w-5xl`.
  1. Ubicación: ícono `map-pin` (`text-oro-300`, 20px) + "Zona Norte de Mérida, Yucatán" (`text-lg sm:text-xl font-medium text-marfil/95 mb-4 gap-2`).
  2. **H1**: "Vive en una Smart Home`<br/>`diseñada para el futuro." (`font-display text-4xl sm:text-6xl xl:text-7xl font-semibold leading-[1.05] tracking-display text-marfil`).
  3. Párrafo `mt-5 max-w-xl text-base sm:text-lg leading-relaxed text-marfil/90`: "Tecnología, seguridad y eficiencia energética en residencias contemporáneas ubicadas en la Zona Norte de Mérida."
  4. Fila `mt-7 flex flex-wrap gap-3`:
     - **Chip precio**: `rounded-full bg-oro px-5 py-2 text-sm font-semibold text-grafito shadow-sm` → "Desde $4.4 MDP*".
     - **Chips glass** (`gap-2`): `inline-flex gap-1.5 rounded-full border border-marfil/30 bg-grafito/30 px-3.5 py-2 text-xs font-medium text-marfil backdrop-blur-sm`, ícono 16px `text-oro-300`:
       `bed-double` 3 Recámaras · `waves-horizontal` Alberca · `sun` Paneles Solares · `cpu` Smart Home.
  5. CTA `mt-8`: "Agenda una Visita y Conoce OX" (CTA hero verde).
- **Flecha scroll**: `a[href=#smart-living]` `absolute bottom-6 left-1/2 -translate-x-1/2 text-marfil/70 hover:text-marfil`, ícono `arrow-down` con `animate-bounce`.
- *Nota*: el hero **no** usa animación de entrada.

### 6.3 Smart Living `#smart-living`
- `section.relative overflow-hidden bg-carbon py-24 sm:py-32 text-marfil`.
- **Textura de puntos**: capa `absolute inset-0 pointer-events-none opacity-[0.04]` con `background-image: radial-gradient(circle at 1px 1px, var(--oro) 1px, transparent 0); background-size: 32px 32px`.
- Heading: eyebrow "Smart Living" · H2 "Mucho más que una casa. Una forma más inteligente de vivir." · p "Una residencia diseñada para ofrecer mayor comodidad, seguridad y eficiencia todos los días."
- **Grid** `mt-14 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6` con 6 tarjetas:
  ```html
  <article class="group overflow-hidden rounded-2xl border border-marfil/10 bg-grafito/40">
    <div class="relative aspect-[4/3] overflow-hidden">
      <img class="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]" …>
    </div>
    <div class="p-6">
      <h3 class="font-display text-xl font-medium text-marfil">…</h3>
      <p class="mt-2 text-sm leading-relaxed text-marfil/70">…</p>
    </div>
  </article>
  ```
  | # | Imagen | Título | Texto | delay |
  |---|---|---|---|---|
  | 1 | `/media/smarthome.webp` | Smart Home | Integración y automatización para una experiencia de vida más práctica. | 0 |
  | 2 | `/media/seguridad.webp` | Seguridad Inteligente | Mayor tranquilidad para ti y tu familia. | 0.08 |
  | 3 | `/media/paneles.webp` | Paneles Solares | Mayor eficiencia y mejor aprovechamiento energético. | 0.16 |
  | 4 | `/media/conectividad.webp` | Conectividad | Espacios preparados para las nuevas formas de vivir y trabajar. | 0 |
  | 5 | `/media/iluminacion.webp` | Iluminación Inteligente | Mayor confort y funcionalidad en cada ambiente. | 0.08 |
  | 6 | `/media/contemporaneo.webp` | Diseño Contemporáneo | Arquitectura pensada para el estilo de vida actual. | 0.16 |
  `sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"`.
- **Cierre**: `mt-16 border-t border-marfil/15 pt-10 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 items-start`:
  - Cita `max-w-xl font-display text-2xl font-light leading-snug text-marfil/95`: "La mejor tecnología es aquella que mejora tu vida sin que tengas que pensar en ella. En OX, cada residencia integra soluciones inteligentes que aportan comodidad, seguridad y bienestar para que tú solo te dediques a disfrutar tu hogar."
  - Botón claro "Conoce OX" (`shrink-0`).

### 6.4 Conoce tu nuevo hogar `#hogar`
- `section.bg-marfil py-24 sm:py-32`.
- Heading: eyebrow "Conoce tu nuevo hogar" · H2 "Espacios diseñados para la vida que quieres construir." · p (`text-carbon/75`) "Cada detalle de OX fue concebido para responder a las necesidades de la vida actual: compartir en familia, trabajar desde casa, descansar, disfrutar y crecer."
- **Carrusel** (`mt-14`): `relative overflow-hidden rounded-2xl`, `aspect-ratio: 16/9`.
  - Autoplay cada **4500 ms**, pausa con hover (mouseenter/leave). Transición **crossfade** (opacity 0→1, 0.7 s, ease `[0.22,1,0.36,1]`, `AnimatePresence mode="popLayout"`).
  - Cada slide es un `button` que abre el **lightbox**; en hover muestra overlay `bg-grafito/25` + pastilla `rounded-full bg-marfil/95 px-5 py-2.5 text-sm font-medium text-grafito shadow-lg` con ícono `eye` (18px) y texto " Ver".
  - Flechas: `absolute left-3/right-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-marfil/80 text-grafito shadow-sm backdrop-blur hover:bg-marfil`, íconos `chevron-left/right` 22px.
  - Dots: `absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2`; activo `h-2 w-6 bg-marfil`, inactivo `h-2 w-2 bg-marfil/50 hover:bg-marfil/80`, `rounded-full transition-all duration-300`.
  - Slides (orden):
    1. `/renders/fachada-principal.webp` — Fachada principal del conjunto residencial OX
    2. `/renders/cocina.webp` — Cocina con isla y comedor integrados
    3. `/renders/recamara-principal.webp` — Recámara principal con acceso a terraza
    4. `/renders/bano-principal.webp` — Baño principal con vestidor
    5. `/renders/lateral-1.webp` — Vista lateral de la residencia OX
    6. `/renders/fachada-posterior.webp` — Fachada posterior con área de alberca
    7. `/renders/recamara-pb.webp` — Recámara en planta baja
    8. `/renders/bano-pb.webp` — Baño en planta baja
    9. `/renders/lateral-2.webp` — Vista lateral alterna de la residencia OX
  - **Lightbox galería**: `fixed inset-0 z-[60] bg-grafito/90 p-4 backdrop-blur-sm flex items-center justify-center`, `role=dialog aria-modal`. Cerrar (arriba‑der., 44px, `bg-marfil/10 text-marfil hover:bg-marfil/20`), flechas 48px (`left-3 sm:left-6`), imagen `object-contain` en caja `h-[78vh] w-full max-w-5xl`, pie de foto (alt) `absolute -bottom-9 text-sm text-marfil/70`. Teclado: Esc / ← / →. Bloquea scroll del body. Click en fondo cierra.
- **Grid inferior** `mt-8 grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10`:
  - **Fichas** (`lg:col-span-2`, `grid-cols-2 sm:grid-cols-3 gap-4`), cada una `rounded-2xl border border-greige/40 bg-white/40 p-5`: ícono 22px `text-oro` → valor `mt-3 font-display text-lg font-semibold text-grafito` → etiqueta `mt-0.5 text-xs text-carbon/65`.
    | Ícono | Valor | Etiqueta |
    |---|---|---|
    | ruler | 281.40 m² | Construcción |
    | maximize | 8 × 30 m | Terreno |
    | bed-double | 3 recámaras | Amplias y confortables |
    | briefcase | Home office | Espacio para trabajar |
    | waves-horizontal | Alberca | Privada |
    | car | 2 autos | Cochera techada |
  - **Lista** (`flex flex-col`): `ul.grid gap-3`, ítems `flex gap-2.5 text-sm text-carbon/85` con `check` `text-verde`: Cocina integral · Jardín · Paneles solares · Diseño contemporáneo · Sistema Smart Home. Debajo `mt-auto pt-6` botón verde "Agenda una visita y conoce OX" (`w-full sm:w-auto lg:w-full`). delay 0.15.
- **Distribución** (`mt-20`):
  - Centrado `max-w-2xl text-center`: eyebrow centrado "Distribución" (text-xs) · H3 "Conoce la distribución de tu residencia." · p `mt-4 text-base text-carbon/75` "Dos niveles pensados para la vida actual: convivencia y servicios en planta baja, descanso y privacidad en planta alta."
  - Botón‑tarjeta del plano: `group relative mx-auto mt-10 block max-w-3xl overflow-hidden rounded-2xl border border-greige/40 bg-white p-4 sm:p-8 shadow-sm hover:shadow-md`; imagen `/renders/planta.webp` (2000×2832) `mx-auto w-full max-w-xl`; badge hover `absolute right-4 top-4 rounded-full bg-grafito/80 px-3 py-1.5 text-xs text-marfil` con `zoom-in` 14px "Ampliar plano".
  - Pie: `mt-4 text-center text-sm text-carbon/60` "Planta baja y planta alta · 281.40 m² de construcción · Toca para ampliar y hacer zoom".
  - **Modal del plano**: `z-[70]`, mismo fondo; caja `max-h-[88vh] max-w-4xl rounded-xl bg-white`; **zoom tipo lupa**: al pasar el cursor `scale(2.4)` con `transform-origin` en la posición del mouse; click alterna zoom (móvil); salida `transform .2s ease-out`; cursor `zoom-in/zoom-out`. Texto inferior `text-xs text-marfil/60`: "Pasa el cursor para hacer zoom · toca la imagen en móvil". Esc cierra.

### 6.5 Ubicación `#ubicacion`
- `section.bg-white/30 py-24 sm:py-32` (blanco 30 % sobre marfil).
- `grid-cols-1 lg:grid-cols-2 gap-12 lg:items-center`.
- Izquierda: eyebrow "Ubicación · Zona Norte de Mérida" · H2 "Vive en la Zona Norte de Mérida." · p "Dzityá, una de las zonas con mayor crecimiento, plusvalía y proyección residencial del norte de Mérida."
- Lista `mt-9 grid-cols-1 sm:grid-cols-2 gap-4`; ítem = cuadro ícono `h-10 w-10 rounded-xl bg-verde/10 text-verde` (ícono 20px) + `text-sm font-medium text-carbon/85`:
  `shopping-bag` Cercanía con servicios y comercios · `route` Conectividad hacia las principales vialidades · `building` Entorno residencial en crecimiento · `trending-up` Alta demanda y plusvalía · `leaf` Calidad de vida y tranquilidad.
- Frase `mt-8 font-display text-lg font-light leading-snug text-carbon/85`: "La ubicación de una casa también define gran parte de su valor futuro."
- Botón verde `mt-7` "Agenda una visita y conoce OX".
- Derecha: `div.overflow-hidden rounded-2xl border border-greige/40 shadow-sm` con `iframe` Google Maps `h-[420px] lg:h-[520px] w-full`, `loading=lazy`, `referrerPolicy=strict-origin-when-cross-origin`, `allowFullScreen`, title "Ubicación de OX Tres Residencias Privadas, Dzityá, Mérida".
  ```
  https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d6161.713903430529!2d-89.6647083!3d21.0643874!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8f56756ff02b7f15%3A0x73a7634f3b9cd9b0!2sOX%20Tres%20Residencias%20Privadas!5e0!3m2!1ses-419!2smx!4v1782519540555!5m2!1ses-419!2smx
  ```
  Coordenadas: **21.0643874, −89.6647083**.

### 6.6 OSTECH Desarrolladora `#ostech`
- `section.bg-verde py-24 sm:py-32 text-marfil`, `grid lg:grid-cols-2 gap-12 lg:items-center`.
- Izquierda: imagen `/renders/lateral-1.webp` en `relative aspect-[4/3] overflow-hidden rounded-2xl` (alt "Detalle arquitectónico de un desarrollo OSTECH").
- Derecha (delay 0.1):
  - Eyebrow `text-xs text-oro-300` (línea `bg-oro-300`) "OSTECH Desarrolladora".
  - H2 (`text-3xl sm:text-4xl`, sin `lg:text-[2.75rem]`): "Detrás de un gran hogar, hay un desarrollador en quien puedes confiar."
  - Párrafos `text-base leading-relaxed text-marfil/75` (`mt-5`, luego `mt-4`):
    1. "Cada proyecto que desarrollamos refleja una visión clara: crear espacios que combinen diseño, innovación, tecnología y calidad constructiva para responder a las nuevas formas de vivir."
    2. "En **OSTECH Desarrolladora** entendemos que adquirir una residencia es una de las decisiones patrimoniales más importantes para una familia. Por ello, cada desarrollo está respaldado por procesos responsables, seguridad jurídica, garantía postventa y un compromiso permanente con quienes depositan su confianza en nosotros." (`strong.font-semibold text-marfil/90`)
    3. "Creemos que un buen desarrollo no termina con la entrega de una casa; comienza con la tranquilidad de saber que detrás de tu inversión existe una empresa sólida, con experiencia y visión de largo plazo."
    4. (`font-semibold text-marfil/90`) "En OX construimos más que residencias; creamos espacios pensados para perdurar, generar valor y acompañar los proyectos de vida de quienes deciden llamarlos hogar."
  - Lista `mt-8 grid sm:grid-cols-2 gap-4`; ícono en `h-10 w-10 rounded-xl border border-oro/30 bg-oro/10 text-oro-300`, texto `text-sm font-medium text-marfil/90`:
    `shield-check` Calidad constructiva · `lightbulb` Innovación integrada · `building-2` Visión de largo plazo · `heart-handshake` Compromiso con cada familia.
  - Botón claro `mt-9` "Conoce el respaldo de OSTECH Desarrolladora" (WhatsApp con mensaje propio, ver §8).

### 6.7 Contacto `#contacto`
- `section.bg-white/30 py-24 sm:py-32` → tarjeta `overflow-hidden rounded-3xl border border-greige/40 bg-marfil shadow-sm lg:grid lg:grid-cols-2`.
- Izquierda (solo `lg+`): `relative min-h-[440px]` con `/renders/fachada-principal.webp` `object-cover` (alt "Te damos la bienvenida a OX Residencial").
- Derecha `p-8 sm:p-12`: eyebrow `text-xs` "Agenda tu visita" · H2 "Agenda una visita y conoce OX en persona." · p `mt-3 text-base text-carbon/75` "Déjanos tus datos y nuestro equipo te contactará para coordinar tu visita a OX."
- **Formulario** `mt-8 space-y-5`, `noValidate`:
  - Label: `text-sm font-medium text-carbon`; asterisco requerido `text-oro`.
  - Input: `mt-1.5 w-full min-h-[48px] rounded-xl border bg-white/60 px-4 text-base text-grafito placeholder-carbon/40 transition-colors focus:border-verde focus:outline-none` + `border-greige/60` (o `border-red-500` con error).
  | Campo | id/name | type | Placeholder | Req. | Validación / mensaje |
  |---|---|---|---|---|---|
  | Nombre | name | text (autocomplete name) | Tu nombre completo | ✔ | "Ingresa tu nombre." |
  | Teléfono | phone | tel | 999 123 4567 | ✔ | `/^[\d\s()+-]{7,}$/` → "Teléfono no válido." / vacío "Ingresa tu teléfono." |
  | Correo electrónico | email | email | tu@correo.com | — | `/^[^\s@]+@[^\s@]+\.[^\s@]+$/` → "Correo no válido." |
  | Ciudad de origen | city | text (address-level2) | Tu ciudad | — | — |
  - Errores: `p.mt-1 text-xs text-red-600 role=alert` (validación en `onBlur` y en submit).
  - **"¿Buscas para?"** (fieldset, `legend text-sm font-medium text-carbon`): 2 radios ocultos (`sr-only`) como botones segmentados `flex-1 rounded-xl border px-4 py-3 text-sm font-medium` — inactivo `border-greige/60 text-carbon/75 hover:border-verde/50`, activo `border-verde bg-verde/10 text-verde`. Opciones: **Vivir**, **Invertir**.
  - **Honeypot** anti‑spam: `div.absolute left-[-9999px] aria-hidden` con input `website` (label "No llenar este campo", `tabIndex=-1`).
  - Submit: `min-h-[52px] w-full rounded-full bg-verde px-8 text-sm font-medium tracking-wide text-marfil hover:bg-verde-700 hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed`, ícono `send` 18px, texto "Agenda una visita y conoce OX" / "Enviando…".
  - Éxito: `p.text-center text-sm font-medium text-verde role=status` "¡Gracias! Recibimos tus datos y te contactaremos muy pronto." (limpia campos). Error: `text-sm text-red-600 role=alert` con mensaje del servidor o "No pudimos enviar tu solicitud."
  - Nota legal `text-center text-xs text-carbon/55`: "Al enviar, tus datos llegarán a nuestro equipo de ventas."
  - Envío: `fetch("/api/contacto", {method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify({name, phone, email, city, intent, website})})`. Respuesta de error esperada: `{ error: string }`.

### 6.8 Footer
- `footer.bg-grafito text-marfil` → `max-w-7xl px-5 py-16 sm:px-8` → `grid grid-cols-1 md:grid-cols-3 gap-12`.
- Col. 1 — **Wordmark** (texto, no imagen): "OX" `block text-2xl font-semibold tracking-display text-marfil font-display` + "Tres Residencias" `mt-1 block text-[0.6rem] font-medium uppercase tracking-[0.35em] text-oro-300`. Párrafo `mt-5 max-w-xs text-sm leading-relaxed text-marfil/55`: "Donde la tecnología se convierte en calidad de vida. Residencias boutique inteligentes en Dzityá, Mérida."
- Col. 2 — título `font-display text-sm font-semibold uppercase tracking-[0.2em] text-oro-300` "Contacto"; `ul.mt-5 space-y-3 text-sm text-marfil/70`, ítems `flex gap-3` con íconos 16px `text-oro-300`:
  - `phone` +52 999 650 0077 (link WhatsApp, `hover:text-marfil`)
  - `clock` Lunes a Sábado · 9:00 a 18:00 h
  - `map-pin` Dzityá, Mérida, Yucatán
- Col. 3 — "Síguenos": botones circulares `h-11 w-11 rounded-full border border-marfil/15 text-marfil/70 hover:border-oro/50 hover:text-oro-300`, SVG 20px: Instagram (`https://www.instagram.com/oxdzitya`), Facebook (`https://www.facebook.com/share/1DrcqH7tr4/`).
- Barra inferior `mt-14 border-t border-marfil/10 pt-6 text-xs text-marfil/45 flex flex-col sm:flex-row sm:justify-between gap-2`: "© 2026 OX Tres Residencias Privadas. Todos los derechos reservados." (año dinámico) | "Un desarrollo de OSTECH Desarrolladora."

### 6.9 Botón flotante WhatsApp
- `a.group fixed bottom-5 right-5 z-50 flex items-center gap-3 rounded-full bg-[#25D366] px-4 py-3 text-white shadow-lg shadow-black/20 transition-transform duration-200 hover:scale-105`
- `style="bottom:max(1.25rem, env(safe-area-inset-bottom)); right:max(1.25rem, env(safe-area-inset-right))"`.
- Ícono WhatsApp 26px + texto "Agenda tu visita" (`hidden sm:block text-sm font-medium`; en móvil solo ícono). `aria-label="Escríbenos por WhatsApp"`.

---

## 7. Animaciones e interacciones

| Elemento | Comportamiento |
|---|---|
| **Reveal on scroll** (componente `Reveal`) | `initial {opacity:0, y:24}` → `whileInView {opacity:1, y:0}`, `viewport {once:true, margin:"-80px"}`, `transition {duration:0.5, delay, ease:[0.22,1,0.36,1]}`. Desactivado con `prefers-reduced-motion`. Se aplica a headings, tarjetas, bloques; **no** al hero ni footer |
| Delays | Tarjetas Smart Living 0 / 0.08 / 0.16 por fila; columna lista Hogar 0.15; lista Ubicación 0.1; mapa 0.1 (aprox.); texto OSTECH 0.1 |
| Header | Transición 300 ms de transparente a marfil/85 + blur al pasar 24 px |
| Tarjetas Smart Living | Zoom de imagen `scale(1.04)` 700 ms ease-out en hover |
| Carrusel | Autoplay 4.5 s, crossfade 0.7 s, pausa en hover, dots que se estiran (w-2 → w-6) |
| Flecha hero | `animate-bounce` (1 s infinito) |
| Botones | `transition-all duration-200`; WhatsApp `hover:scale-105` |
| Lightbox / modal plano | Esc, flechas, bloqueo de scroll, click fuera cierra; zoom lupa 2.4× |
| Scroll | `scroll-behavior: smooth`, `scroll-padding-top: 8rem` |
| Focus | Outline 2px `--oro`, offset 2px |

---

## 8. Enlaces de WhatsApp

Generador `waLink({name, phone, city, intent, context})` → `https://wa.me/5219996500077?text=<encodeURIComponent(mensaje)>`.
- Mensaje por defecto: **"Hola, me gustaría recibir información sobre OX Residencial y agendar una visita."**
- Si hay datos, anexa: "Mi nombre es X." "Mi teléfono es X." "Soy de X." "Busco para vivir/invertir."
- Botón OSTECH usa: **"Hola, me gustaría conocer más sobre OX Residencial y OSTECH Desarrolladora, y agendar una visita."**

Total de CTAs a WhatsApp: header, hero, Smart Living, Hogar, Ubicación, OSTECH, footer (teléfono), flotante, menú móvil.

---

## 9. SEO / Metadatos

```html
<title>OX Residencial | Smart Living en Dzityá, Mérida</title>
<meta name="description" content="Residencias boutique en Dzityá, Mérida que integran tecnología, seguridad y eficiencia. Donde la tecnología se convierte en calidad de vida. Agenda tu visita.">
<meta name="keywords" content="OX Residencial,casas inteligentes Mérida,smart home Dzityá,residencias boutique Mérida,OSTECH Desarrolladora,casas en venta Mérida">
<meta property="og:title" content="OX Residencial | Smart Living en Dzityá, Mérida">
<meta property="og:description" content="Residencias boutique que integran tecnología, seguridad y eficiencia. Una nueva forma de vivir en Mérida.">
<meta property="og:site_name" content="OX Residencial">
<meta property="og:locale" content="es_MX">
<meta property="og:image" content="https://www.oxresidencial.com/renders/fachada-principal.webp"> <!-- 2000×1333 -->
<meta property="og:type" content="website">
<meta name="twitter:card" content="summary_large_image"> <!-- + title, description, image iguales -->
<link rel="icon" href="/favicon.ico" sizes="256x256">
```
No hay robots.txt, sitemap, manifest ni datos estructurados (JSON‑LD).

---

## 10. Inventario de assets

| Ruta | Peso | Dimensiones | Uso |
|---|---|---|---|
| `/logo-ox.png` | 261 KB | 1150×704 (RGBA) | Logo header |
| `/favicon.ico` | 25 KB | 256×256 | Favicon |
| `/media/video-ox-cortado.mp4` | 36.8 MB | **1080×1920 (vertical)**, H.264 + AAC, 30 fps, **48.2 s** | Video hero (`object-cover` lo recorta en horizontal; el reinicio a 50 s nunca se dispara, el `loop` nativo basta) |
| `/media/smarthome.webp` | 42 KB | 1500×1001 | Tarjeta 1 |
| `/media/seguridad.webp` | 70 KB | 1500×841 | Tarjeta 2 |
| `/media/paneles.webp` | 184 KB | 1448×1086 | Tarjeta 3 |
| `/media/conectividad.webp` | 310 KB | 1500×1499 | Tarjeta 4 |
| `/media/iluminacion.webp` | 103 KB | 1500×1500 | Tarjeta 5 |
| `/media/contemporaneo.webp` | 78 KB | 1055×791 | Tarjeta 6 |
| `/renders/fachada-principal.webp` | 254 KB | 2000×1407 (el `og:image:height` declara 1333) | Poster video, slide 1, contacto, OG |
| `/renders/cocina.webp` | 43 KB | 1280×720 | Slide 2 |
| `/renders/recamara-principal.webp` | 119 KB | 1280×903 | Slide 3 |
| `/renders/bano-principal.webp` | 121 KB | 1117×854 | Slide 4 |
| `/renders/lateral-1.webp` | 234 KB | 2000×1407 | Slide 5 + imagen OSTECH |
| `/renders/fachada-posterior.webp` | 305 KB | 2000×1407 | Slide 6 |
| `/renders/recamara-pb.webp` | 43 KB | 1600×900 | Slide 7 |
| `/renders/bano-pb.webp` | 37 KB | 1600×900 | Slide 8 |
| `/renders/lateral-2.webp` | 300 KB | 2000×1407 | Slide 9 |
| `/renders/planta.webp` | 69 KB | 2000×2832 | Plano arquitectónico |

**Ubicación en la réplica (Astro):**
- `src/assets/logo-ox.png`, `src/assets/media/*.webp`, `src/assets/renders/*.webp` → las optimiza `astro:assets` (`<Image>` / `getImage`) en el build: genera webp en varios anchos con `srcset`/`sizes` y hash en el nombre.
- `public/media/video-ox-cortado.mp4` y `public/favicon.ico` → se sirven tal cual.
- La imagen OG y el poster del video salen de `fachada-principal.webp` vía `getImage` (URL absoluta con `site` de `astro.config.mjs`).

### Íconos lucide-react usados
`Menu, X, MapPin, BedDouble, WavesHorizontal, Sun, Cpu, ArrowDown, Eye, ChevronLeft, ChevronRight, Ruler, Maximize, Briefcase, Car, Check, ZoomIn, ShoppingBag, Route, Building, TrendingUp, Leaf, ShieldCheck, Lightbulb, Building2, HeartHandshake, Send, Phone, Clock`.
Tamaños exactos (medidos en el HTML original; trazo 2 salvo donde se indica):
- 24px: map-pin del hero, menu/x, cerrar diálogos · 26px: chevrons del visor
- 22px: arrow-down del hero, chevrons del carrusel · 22px **trazo 1.6**: íconos de las fichas (ruler, maximize, bed-double, briefcase, waves-horizontal, car)
- 20px **trazo 1.6**: íconos en caja de Ubicación y OSTECH
- 18px: eye, send · 17px: check de la lista, íconos del footer (phone, clock, map-pin) · 15px: chips del hero · 14px: zoom-in
- `Building2` de lucide ahora se llama **`building-complex`** (`@lucide/astro/icons/building-complex`).
Instagram/Facebook/WhatsApp: SVG `viewBox="0 0 24 24" fill="currentColor"` (paths en el HTML original, sección footer y botón flotante).

---

## 11. Arquitectura de la réplica (Astro 6 + Tailwind v4, sin Framer Motion)

**Versiones:** `astro@6.4.8`, `@astrojs/vercel@10`, `tailwindcss@4` + `@tailwindcss/vite`, `@lucide/astro`, `@fontsource/outfit`, `@fontsource/inter`. Node ≥ 22.12. (Astro 7 pide Node ≥ 22.23.4; para subir de versión hay que actualizar Node primero.)

```
astro.config.mjs        site, output "static", adapter Vercel, plugin Tailwind
src/
  styles/global.css     tokens, @theme, regla global de bordes, fuentes, animaciones CSS
  layouts/Layout.astro  <head>: título, descripción, OG/Twitter, favicon; quita la clase .no-js
  pages/index.astro     orden de secciones
  pages/api/contacto.ts POST JSON (único endpoint en servidor: prerender = false)
  components/
    Header.astro        estado con scroll (data-scrolled) + menú móvil (data-menu-open)
    Hero.astro          video + overlay + chips + CTA
    SmartLiving.astro   textura de puntos + 6 tarjetas
    Hogar.astro         galería + fichas + lista + distribución
    Gallery.astro       carrusel (crossfade) + visor en <dialog>
    FloorPlan.astro     plano + <dialog> con zoom tipo lupa
    Ubicacion.astro     lista + mapa embebido
    Ostech.astro
    Contacto.astro      formulario con validación y estados
    Footer.astro, WhatsAppFloat.astro
    Reveal.astro        envoltorio de aparición al hacer scroll
    SectionHeading.astro, Eyebrow.astro, Button.astro
  lib/whatsapp.ts       waLink() y mensajes
  scripts/scroll-lock.ts
  assets/               imágenes optimizadas por astro:assets
public/                 favicon.ico, media/video-ox-cortado.mp4
```

### Equivalencias de animación (Framer Motion → CSS)
| Original | Réplica |
|---|---|
| `motion.div` con `whileInView` (opacity 0→1, y 24→0, 0.5 s, ease `[0.22,1,0.36,1]`, `once`, margen −80px) | Clase `.reveal` → `.is-visible` con `transition` CSS; `IntersectionObserver` (`rootMargin: -80px`) solo añade la clase. Retraso por `style="--reveal-delay:0.08s"` |
| `AnimatePresence` crossfade 0.7 s | `.slide` / `.slide.is-active` con `transition: opacity .7s` |
| Dots `w-2` → `w-6` | `.dot` / `.dot[aria-current=true]` con `transition-all duration-300` |
| Header con clases condicionales | `.site-header[data-scrolled=true]` en CSS |
| Zoom del plano con `style` inline | `.plan-zoom-img.is-zoomed { transform: scale(2.4) }`, JS solo mueve `transform-origin` |
| Lightbox con `div` fijo + listeners de teclado | `<dialog>` nativo (`showModal`): Esc, foco y capa superior gratis; flechas ← → con JS |
| Segmentado Vivir/Invertir con estado React | `label:has(input:checked)` en CSS |
| `useReducedMotion` | `@media (prefers-reduced-motion: reduce)` → `.reveal` visible y transiciones a 0 |

JS que queda en el cliente (vanilla, ~6 KB sin comprimir entre archivos y scripts en línea, frente a ~650 KB del original): scroll del header y menú, carrusel y visor, zoom del plano, `IntersectionObserver` de las apariciones y el formulario. Sin JS (`.no-js`), todo el contenido se muestra.

### Endpoint `/api/contacto`
Valida igual que el cliente, ignora en silencio el honeypot `website` y reenvía el lead en JSON a `CONTACT_WEBHOOK_URL` (variable de entorno; ver `.env.example`). Sin esa variable, solo registra el lead en los logs del servidor. **El sitio original no muestra a dónde manda los datos; hay que definir el destino real** (correo, CRM, hoja de cálculo…).

### Comandos
```
npm run dev      # http://localhost:4321
npm run build    # salida en .vercel/output (estático + función)
npm run preview
```

### Verificación (18-nov-2026)
Comparado contra el original a 1440 px y 375 px: posiciones y alturas de todas las secciones y elementos clave coinciden con diferencias ≤ 1 px. Probados: menú móvil, header con scroll, carrusel, visor (teclado y clic fuera), zoom del plano, validación del formulario, respuestas 422/200 del endpoint y apariciones al hacer scroll.

---

## 12. Checklist de fidelidad

- [ ] Regla global `* { border-color: greige 45% }` fuera de `@layer` (todos los bordes greige).
- [ ] `rounded-xl = 1rem`, `rounded-2xl = rounded-3xl = 1.5rem`.
- [ ] Logo de 112/128 px de alto (header alto ~137/153 px) y `scroll-padding-top: 8rem`.
- [ ] Header cambia a marfil/85 + blur + borde al superar 24 px de scroll; links cambian a carbon/80 → hover verde.
- [ ] H1 con `leading-[1.05]` y salto de línea explícito.
- [ ] Textura de puntos oro al 4 % en Smart Living.
- [ ] Carrusel 16:9, 4.5 s, crossfade 0.7 s, 9 slides en el orden indicado.
- [ ] Modal del plano con zoom 2.4× siguiendo el cursor.
- [ ] Formulario con validación en blur, honeypot, segmentado Vivir/Invertir y estados idle/sending/sent/error.
- [ ] Botón WhatsApp flotante con safe‑area y texto oculto en móvil.
- [ ] Reveal con ease `[0.22,1,0.36,1]`, 0.5 s, y 24 px, `once`, margen −80 px; respeta reduced‑motion.
- [ ] Textos copiados literalmente (acentos incluidos) de este documento.

---

## 13. Mejoras de diseño v2 (sobre la réplica)

A partir de aquí el sitio **deja de ser idéntico** al original a propósito. El contenido (textos, imágenes, datos, enlaces) no cambia; solo se agregan un botón secundario en el hero ("Conoce la residencia" → `#hogar`), numeración decorativa en las tarjetas y el contador de la galería.

| Área | Problema en el original | Mejora |
|---|---|---|
| **Header** | ~153 px de alto (logo de 112–128 px); links marfil y logo verde sin contraste sobre la fachada clara del video | Píldora flotante de vidrio marfil (`.nav-shell`, `max-w-6xl`, `rounded-3xl`, blur 14px). Logo de 48/56 px que baja a 44 px con scroll. Alto total ~58 px. `scroll-padding-top` de 8rem a 6rem |
| **Navegación** | Sin indicador de sección | Subrayado dorado animado al pasar el cursor y en la sección activa (`aria-current`, IntersectionObserver) |
| **Menú móvil** | Aparece de golpe | Despliegue suave (`grid-template-rows 0fr → 1fr`), links en Outfit 18px con flecha dorada, cierra con Esc, links fuera del orden de tabulación cuando está cerrado |
| **Hero: legibilidad** | Degradado solo de abajo hacia arriba; el texto queda sobre la parte más brillante del video | Doble degradado (`.hero-scrim`): oscurece izquierda y abajo, deja ver la arquitectura a la derecha; en móvil, degradado vertical más denso. Sombra de texto suave |
| **Hero: jerarquía** | Todo el H1 en marfil | Segunda línea del H1 en `oro-300`; ubicación dentro de una píldora de vidrio |
| **Hero: movimiento** | Contenido estático | Entrada escalonada (`.hero-in`: opacidad, 28px y desenfoque, retrasos 0.15–1.1 s), zoom lento del video al cargar (`ken-burns` 2.4 s) e indicador de scroll tipo "mouse" |
| **CTA** | Botones planos | Flecha que avanza al pasar el cursor (`.cta-arrow`) en todos los botones; CTA secundario con borde en el hero |
| **Smart Living** | Tarjetas estáticas | Elevación al pasar el cursor (`.lift`), borde dorado, numeración 01–06, degradado sobre la foto, línea dorada que crece. Cita con filete dorado a la izquierda |
| **Galería** | Solo puntos | Contador "04 / 09" y pie de foto sobre un degradado; puntos a la derecha en escritorio |
| **Fichas y lista** | Íconos sueltos | Ícono en caja dorada que se rellena al pasar el cursor; checks en círculo verde con separadores |
| **Ubicación** | Mapa a todo color que rompe la paleta | Mapa desaturado con tono cálido (`.map-tint`) que recupera el color al pasar el cursor; íconos que se rellenan de verde |
| **OSTECH** | Imagen plana | Marco dorado desplazado detrás de la imagen y sombra profunda |
| **Formulario** | La regla global de bordes anulaba `focus:border-verde` y `border-red-500`: **no había indicador de foco ni de error** | La regla de bordes pasa a `@layer base` (solo valor por defecto). Foco con borde verde y halo `ring-4 ring-verde/10`; error en rojo; foco visible en Vivir/Invertir |
| **WhatsApp** | — | Pulso discreto 3 veces al cargar, luego se detiene |

**Accesibilidad:** todas las animaciones nuevas se desactivan con `prefers-reduced-motion`.

**Consecuencia del cambio de bordes:** ahora sí se ven los colores de borde que el markup original pedía (`border-marfil/10` en tarjetas oscuras, `border-marfil/30` en los chips del hero, `border-oro/30` en OSTECH, etc.). Ya no aplica el punto de la checklist sobre replicar la regla global fuera de capa.
