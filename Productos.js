const productos = [
  {
    nombre: "Matte Pomade Firme (Strong)",
    precio: 199,
    precioOriginal: 250,
    descripcion: "Pomada mate sin brillo, fijación fuerte todo el día. Ideal para peinado natural. Más vendido.",
    categoria: "pomada",
    keywords: ["matte", "sin brillo", "fuerte", "fijacion", "natural", "peinado", "pomada"],
    imagen: "images/matte_pomade.svg",
    relacionado: ["Shampoo Sábila y Aguacate", "Acondicionador Miel y Yogurt"]
  },
  {
    nombre: "Original Pomade",
    precio: 199,
    precioOriginal: 240,
    descripcion: "Pomada clásica con brillo medio y fijación durable. Estilo vintage.",
    categoria: "pomada",
    keywords: ["original", "clasica", "brillo", "pomada"],
    imagen: "images/original_pomade.svg",
    relacionado: ["Tónico After Shave Red 250ml", "Shampoo Sábila y Aguacate"]
  },
  {
    nombre: "Black Pomade",
    precio: 209,
    precioOriginal: 260,
    descripcion: "Pomada con cobertura para canas y fijación extra. Perfect para cabellos oscuros.",
    categoria: "pomada",
    keywords: ["black", "negra", "canas", "cobertura", "pomada", "oscuro"],
    imagen: "images/black_pomade.svg",
    relacionado: ["Shampoo Sábila y Aguacate"]
  },
  {
    nombre: "Gel Strong Hold",
    precio: 179,
    precioOriginal: 220,
    descripcion: "Gel de fijación fuerte. Ideal para look moderno y estructurado sin brillo.",
    categoria: "gel",
    keywords: ["gel", "fijacion", "hold", "moderno", "estructurado"],
    imagen: "images/gel_strong.svg",
    relacionado: ["Shampoo Sábila y Aguacate"]
  },
  {
    nombre: "Shampoo Sábila y Aguacate",
    precio: 199,
    precioOriginal: 220,
    descripcion: "Limpia y restaura el cabello desde la raíz, aporta brillo natural. Para uso diario.",
    categoria: "shampoo",
    keywords: ["shampoo", "sabila", "aguacate", "limpieza", "brillo", "higiene"],
    imagen: "images/shampoo_sabila_aguacate.svg",
    relacionado: ["Matte Pomade Firme (Strong)", "Acondicionador Miel y Yogurt"]
  },
  {
    nombre: "Acondicionador Miel y Yogurt",
    precio: 199,
    precioOriginal: 220,
    descripcion: "Hidratación profunda, fortalece y suaviza el cabello. Uso 2-3 veces por semana.",
    categoria: "acondicionador",
    keywords: ["acondicionador", "miel", "yogurt", "hidratacion", "suavidad"],
    imagen: "images/acondicionador_miel_yogurt.svg",
    relacionado: ["Shampoo Sábila y Aguacate", "Matte Pomade Firme (Strong)"]
  },
  {
    nombre: "Tónico After Shave Red 250ml",
    precio: 269,
    precioOriginal: 300,
    descripcion: "Refresca y calma la piel después del afeitado. Aroma clásico y duradero.",
    categoria: "tonico",
    keywords: ["tonico", "after shave", "afeitado", "piel", "calmante"],
    imagen: "images/tonico_after_shave.svg",
    relacionado: ["Black Pomade", "Shampoo Sábila y Aguacate"]
  },
  {
    nombre: "Gotas de Seda Termoprotectoras",
    precio: 209,
    precioOriginal: 249,
    descripcion: "Protege del calor y da suavidad sedosa. Esencial antes de secar con secador.",
    categoria: "tratamiento",
    keywords: ["gotas", "seda", "termoprotector", "calor", "proteccion", "brillo"],
    imagen: "images/gotas_seda.svg",
    relacionado: ["Matte Pomade Firme (Strong)", "Shampoo Sábila y Aguacate"]
  },
  {
    nombre: "Cera Moldeadora Premium",
    precio: 229,
    precioOriginal: 280,
    descripcion: "Cera flexible con fijación moderada. Perfecta para looks texturizados y movimiento natural.",
    categoria: "cera",
    keywords: ["cera", "moldear", "flexible", "textura", "natural", "movimiento"],
    imagen: "images/cera_moldeadora.svg",
    relacionado: ["Shampoo Sábila y Aguacate", "Gel Strong Hold"]
  },
  {
    nombre: "Bálsamo Barba Viajero (50ml)",
    precio: 159,
    precioOriginal: 189,
    descripcion: "Suaviza y acondiciona la barba. Tamaño perfecto para llevar a todos lados.",
    categoria: "barba",
    keywords: ["barba", "balsa", "viajar", "travel", "bolsillo"],
    imagen: "images/balsamo_barba.svg",
    relacionado: ["Tónico After Shave Red 250ml"]
  },
  {
    nombre: "Aceite Barba Premium (100ml)",
    precio: 299,
    precioOriginal: 380,
    descripcion: "Nutre profundamente la barba, suavidad y brillo incomparables. Aroma premium.",
    categoria: "barba",
    keywords: ["aceite", "barba", "premium", "lujo", "nutricion", "aroma"],
    imagen: "images/aceite_barba.svg",
    relacionado: ["Tónico After Shave Red 250ml", "Bálsamo Barba Viajero (50ml)"]
  },
  {
    nombre: "Pack 12 Pomadas Varias",
    precio: 1308,
    precioOriginal: 1668,
    descripcion: "Pack surtido de pomadas, ideal para mayoreo, peluquerías o variedad personal.",
    categoria: "pack",
    keywords: ["pack", "paquete", "12", "mayoreo", "combo"],
    imagen: "images/pack_pomadas.svg",
    relacionado: ["Matte Pomade Firme (Strong)", "Original Pomade", "Black Pomade"]
  }
];

// Función helper para buscar producto por keyword (mejorada)
function buscarProducto(mensaje) {
  // Normalizar texto (quita acentos) para mejorar coincidencias
  const lower = mensaje.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  return productos
    .filter(p => {
      const name = p.nombre.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      const category = p.categoria.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      const kwMatch = p.keywords.some(k => lower.includes(k.normalize('NFD').replace(/[\u0300-\u036f]/g, '')));
      return kwMatch || lower.includes(name) || lower.includes(category);
    })
    .sort((a, b) => {
      const aName = a.nombre.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      const bName = b.nombre.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      const aMatch = a.keywords.filter(k => lower.includes(k.normalize('NFD').replace(/[\u0300-\u036f]/g, ''))).length + (lower.includes(aName) ? 2 : 0);
      const bMatch = b.keywords.filter(k => lower.includes(k.normalize('NFD').replace(/[\u0300-\u036f]/g, ''))).length + (lower.includes(bName) ? 2 : 0);
      return bMatch - aMatch;
    });
}

// Obtener recomendaciones relacionadas
function obtenerRelacionados(productoNombre) {
  const prod = productos.find(p => p.nombre === productoNombre);
  if (!prod) return [];
  return productos.filter(p => prod.relacionado.includes(p.nombre));
}

// NUEVA: Obtener productos por categoría
function obtenerPorCategoria(categoria) {
  return productos.filter(p => p.categoria.toLowerCase() === categoria.toLowerCase());
}

// NUEVA: Obtener productos en rango de presupuesto
function obtenerPorPresupuesto(minPrice, maxPrice) {
  return productos.filter(p => p.precio >= minPrice && p.precio <= maxPrice)
    .sort((a, b) => a.precio - b.precio);
}


function recomendarPorCorte(tipoCorte) {
  const lower = tipoCorte.toLowerCase();
  
  if (/pompadour|volumen|arriba/.test(lower)) {
    return productos.filter(p => 
      p.keywords.some(k => ['pomada', 'cera', 'gel'].includes(k))
    ).slice(0, 3);
  } else if (/fade|limpio|undercut/.test(lower)) {
    return productos.filter(p => 
      p.keywords.some(k => ['gel', 'shampoo', 'tonico'].includes(k))
    ).slice(0, 3);
  } else if (/barba|afeitado/.test(lower)) {
    return productos.filter(p => 
      p.categoria === 'barba' || p.keywords.includes('afeitado')
    ).slice(0, 3);
  }
  
  return productos.slice(0, 3);
}
