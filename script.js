/* ====== CONFIGURACIÓN: cambiá estos datos por los tuyos ====== */
const CONFIG = {
  whatsapp: "5491131621380",            // código de país + área + número, sin signos
  instagram: "https://instagram.com/joshuabarber2026"
};
/* Fotos de la galería: poné tus imágenes en la carpeta img/ */
const FOTOS = [
  { src: "accets/img/WhatsApp Image 2026-11-05 at 19.15.11.jpeg", cat: "cortes", alt: "Degradado clásico" },
  { src: "accets/img/WhatsApp Image 2026-11-05 at 19.16.10.jpeg", cat: "barba",  alt: "Perfilado de barba" },
  { src: "accets/img/WhatsApp Image 2026-11-05 at 19.16.33.jpeg", cat: "curso",  alt: "Clase práctica del curso" },
  { src: "accets/img/WhatsApp Image 2026-11-05 at 19.17.01.jpeg", cat: "cortes", alt: "Corte moderno" },
  { src: "accets/img/WhatsApp Image 2026-11-05 at 19.17.42.jpeg", cat: "barba",  alt: "Barba con navaja" },
  { src: "accets/img/WhatsApp Image 2026-11-07 at 15.16.44 (1).jpeg", cat: "curso",  alt: "Alumnos practicando" },
  { src: "accets/img/WhatsApp Image 2026-11-07 at 15.16.44 (2).jpeg", cat: "cortes", alt: "Fade con diseño" },
  { src: "accets/img/WhatsApp Image 2026-11-07 at 15.16.44.jpeg", cat: "cortes", alt: "El local" }
];
/* ============================================================ */

const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];
const waLink = t => `https://wa.me/${CONFIG.whatsapp}` + (t ? `?text=${encodeURIComponent(t)}` : "");

// Enlaces de contacto desde la configuración
$$("[data-wa]").forEach(a => a.href = waLink("Hola, quiero reservar un turno"));
$$("[data-social]").forEach(a => {
  const k = a.dataset.social;
  a.href = k === "whatsapp" ? waLink("Hola, quiero hacer una consulta") : CONFIG[k];
});

// Menú móvil
const burger = $("#burger"), menu = $("#menu");
const cerrar = () => { menu.classList.remove("open"); burger.setAttribute("aria-expanded", "false"); };
burger.addEventListener("click", () => {
  const abierto = menu.classList.toggle("open");
  burger.setAttribute("aria-expanded", abierto);
});
$$("#menu a").forEach(a => a.addEventListener("click", cerrar));
addEventListener("scroll", () => $("#nav").classList.toggle("sc", scrollY > 10), { passive: true });

// Link activo según la sección visible
const links = $$("#menu a[href^='#']");
const spy = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) links.forEach(l => l.classList.toggle("on", l.getAttribute("href") === "#" + e.target.id));
}), { rootMargin: "-45% 0px -50% 0px" });
$$("main section[id]").forEach(s => spy.observe(s));

// Aparición al hacer scroll
const rv = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) { e.target.classList.add("v"); rv.unobserve(e.target); }
}), { threshold: .12 });
$$(".reveal").forEach(el => rv.observe(el));

// Pestañas de beneficios
function tab(nombre) {
  $$(".tab").forEach(b => { const on = b.dataset.tab === nombre; b.classList.toggle("on", on); b.setAttribute("aria-selected", on); });
  $$(".panel").forEach(p => p.hidden = p.id !== "p-" + nombre);
}
$$(".tab").forEach(b => b.addEventListener("click", () => tab(b.dataset.tab)));
$$("[data-goto]").forEach(a => a.addEventListener("click", () => tab(a.dataset.goto)));

// Galería con filtros
const grid = $("#grid");
let visibles = [], actual = 0;
const iconoVacio = '<svg viewBox="0 0 24 24"><circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M20 4 8.1 15.9M14.5 14.5 20 20M8.1 8.1 12 12"/></svg>';

function pintar(f) {
  grid.innerHTML = "";
  visibles = FOTOS.filter(x => f === "todo" || x.cat === f);
  visibles.forEach((x, i) => {
    const d = document.createElement("div");
    d.className = "it";
    d.style.animationDelay = i * 50 + "ms";
    const img = new Image();
    img.src = x.src; img.alt = x.alt; img.loading = "lazy";
    img.onerror = () => { d.className = "it vacio"; d.innerHTML = iconoVacio + "Tu foto aquí<br>" + x.src; d.onclick = null; };
    d.appendChild(img);
    d.onclick = () => abrir(i);
    grid.appendChild(d);
  });
}
$$(".chip").forEach(c => c.addEventListener("click", () => {
  $$(".chip").forEach(x => x.classList.toggle("on", x === c));
  pintar(c.dataset.f);
}));
pintar("todo");

// Lightbox
const lb = $("#lb"), lbi = $("#lbi");
function abrir(i) { actual = i; mostrar(); lb.hidden = false; document.body.style.overflow = "hidden"; }
function mostrar() { const x = visibles[actual]; lbi.src = x.src; lbi.alt = x.alt; }
function cerrarLb() { lb.hidden = true; document.body.style.overflow = ""; }
function mover(d) {
  const ok = visibles.map((x, i) => i).filter(i => !grid.children[i].classList.contains("vacio"));
  if (!ok.length) return;
  let p = ok.indexOf(actual);
  actual = ok[(p + d + ok.length) % ok.length];
  mostrar();
}
$("#lbx").onclick = cerrarLb;
$("#lbp").onclick = () => mover(-1);
$("#lbn").onclick = () => mover(1);
lb.addEventListener("click", e => { if (e.target === lb) cerrarLb(); });
addEventListener("keydown", e => {
  if (lb.hidden) return;
  if (e.key === "Escape") cerrarLb();
  if (e.key === "ArrowLeft") mover(-1);
  if (e.key === "ArrowRight") mover(1);
});
let x0 = null;
lb.addEventListener("touchstart", e => x0 = e.touches[0].clientX, { passive: true });
lb.addEventListener("touchend", e => {
  if (x0 === null) return;
  const dx = e.changedTouches[0].clientX - x0;
  if (Math.abs(dx) > 50) mover(dx < 0 ? 1 : -1);
  x0 = null;
});

// Formulario -> WhatsApp
$("#form").addEventListener("submit", e => {
  e.preventDefault();
  const f = e.target, nombre = f.nombre.value.trim();
  if (!nombre) { $("#err").textContent = "Escribí tu nombre para continuar."; f.nombre.focus(); return; }
  $("#err").textContent = "";
  const t = `Hola, soy ${nombre}. Quiero: ${f.interes.value}.` + (f.msg.value.trim() ? ` ${f.msg.value.trim()}` : "");
  window.open(waLink(t), "_blank", "noopener");
});

// Logo: si todavía no cargaste img/logo.png, se muestra un recuadro "LOGO"
$$("img[class^='logo-']").forEach(img => {
  const falta = () => { const p = document.createElement("span"); p.className = "logo-ph"; p.textContent = "TU LOGO"; img.replaceWith(p); };
  if (img.complete && img.naturalWidth === 0) falta(); else img.addEventListener("error", falta, { once: true });
});