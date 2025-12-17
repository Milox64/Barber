# Ejemplos de Conversación - AlfaBot Macho Alfa 💈

## Frases que los clientes pueden escribir para probar

### 1. **Consulta sobre Cortes**
```
"¿Qué cortes tienen?"
"Busco un corte con volumen"
"Quiero un fade bien limpio"
"Me late el pompadour, ¿cuánto cuesta?"
"Tengo cabello ondulado, ¿qué me recomiendas?"
"Un undercut pero no tan extremo"
```

### 2. **Consulta sobre Productos**
```
"Necesito una pomada"
"¿Tienen algo para la barba?"
"Quiero un shampoo de calidad"
"Pomada que no brille mucho"
"Algo para proteger el cabello del calor"
"¿Cuál es la más vendida?"
```

### 3. **Recomendaciones**
```
"¿Qué me recomiendas?"
"Hazme un combo, estoy corto de dinero"
"¿Cuál pomada va mejor con fade clásico?"
"Algo que me ayude a mantener el corte"
"Productos para cabello rizado"
"¿Vale la pena el precio premium?"
```

### 4. **Información de Precios**
```
"¿Cuánto cuesta un corte?"
"Tengo presupuesto de $500, ¿qué me va?"
"¿Hay descuentos?"
"¿Es muy caro el corte + barba?"
"Precio del fade"
"¿Tienen opciones baratas?"
```

### 5. **Reservas y Citas**
```
"Quiero reservar"
"¿Cuándo puedo ir?"
"Agéndame para mañana a las 3pm"
"¿Qué horarios atienden?"
"Tengo disponible el sábado"
"¿Necesito cita o puedo llegar así?"
```

### 6. **Cancelación**
```
"Necesito cancelar mi cita"
"¿Cómo cancelo una cita?"
"Ya no puedo ir"
```

### 7. **Ubicación e Información**
```
"¿Dónde están ubicados?"
"¿Cuál es el teléfono?"
"¿Cómo llego?"
"Envíame la dirección"
"¿Atienden los domingos?"
```

### 8. **Saludos y Otros**
```
"¡Hola!"
"¿Qué onda?"
"Gracias"
"Ok, perfecto"
```

---

## Mecánicas Inteligentes Implementadas 🤖

### 1. **Detección de Intención**
El bot detecta automáticamente si buscas:
- 🎯 **Cortes** (fade, undercut, pompadour, etc.)
- 🛍️ **Productos** (pomada, shampoo, tónico)
- 📅 **Reserva de cita**
- ❌ **Cancelación**
- 💰 **Información de precios**
- 💡 **Recomendaciones**
- 🕐 **Horarios**
- 📍 **Ubicación**

### 2. **Recomendaciones Contextuales Lógicas**
Si dices "quiero un corte con volumen":
- Te sugiere Pompadour, Fade Undercut
- Te recomienda pomadas o ceras para mantener el volumen
- Te propone el combo ideal

Si dices "busco algo limpio":
- Te muestra Skin Fade, Fade Clásico
- Te recomienda geles y shampoos para estilo limpio
- Sugiere tónico para cuidado

### 3. **Extracción de Presupuesto**
Detecta si mencionas presupuesto y filtra productos accordingly:
```
"Tengo $300" → Muestra productos hasta $300
"Presupuesto $500" → Cortes y productos en ese rango
```

### 4. **Aprendizaje de Preferencias**
Guarda tu estilo preferido durante la conversación:
- Si mencionas "volumen" → guarda esa preferencia
- Si mencionas "limpio" → personaliza futuras recomendaciones
- Si preguntas por barba → enfoca en esos productos

### 5. **Historial de Conversación**
- El bot recuerda lo que dijiste antes
- Usa contexto para dar respuestas más relevantes
- No repite recomendaciones innecesarias

### 6. **Fallback Inteligente**
Si no entiende algo, en lugar de un error genérico:
```
"Hmm, no capté bien 😅 
¿Andas buscando un corte, productos, o quieres agendar cita?"
```

### 7. **Upsell Lógico (No Invasivo)**
Cuando recomienda un corte:
```
"Elegiste Fade Clásico ($500, 45 min)"
"Para mantener ese corte crispy, te recomiendo:
• Matte Pomade Firme - mantiene el volumen
• Shampoo Sábila - para cuidar el cabello"
```

---

## Catálogo de Servicios Expandido 💈

| Servicio | Precio | Duración | Descripción |
|----------|--------|----------|------------|
| Fade Clásico | $500 | 45 min | Degradado perfecto de los costados |
| Fade Undercut | $550 | 50 min | Volumen arriba, costados limpios |
| Pompadour | $600 | 55 min | Clásico con volumen hacia atrás |
| Buzz Cut | $400 | 30 min | Corte militar pulcro |
| Skin Fade | $550 | 50 min | Fade extremo casi a ras |
| Corte + Barba Premium | $850 | 70 min | Corte + perfilado de barba |
| Afeitado Clásico | $400 | 30 min | Afeitado tradicional con navaja |
| Tratamiento Capilar | $450 | 45 min | Hidratación profunda del cabello |

---

## Catálogo de Productos Expandido 🛍️

### Pomadas (5)
- Matte Pomade Firme
- Original Pomade
- Black Pomade
- Gel Strong Hold
- Cera Moldeadora Premium

### Cuidado del Cabello (3)
- Shampoo Sábila y Aguacate
- Acondicionador Miel y Yogurt
- Gotas de Seda Termoprotectoras

### Cuidado de Barba (3)
- Tónico After Shave Red
- Bálsamo Barba Viajero (50ml)
- Aceite Barba Premium (100ml)

### Packs (1)
- Pack 12 Pomadas Varias

---

## Tips para Usar el Chatbot 🎯

1. **Sé natural**: Escribe como hablas, sin estar muy formal
2. **Sé específico**: "Quiero volumen" es mejor que "corte"
3. **Menciona presupuesto si es importante**: "Tengo $400"
4. **Pregunta sobre recomendaciones**: El bot es experto en sugerir combos
5. **Prueba flujos completos**: Desde corte → productos → reserva

---

## Próximas Mejoras (Roadmap) 🚀

- [ ] Integrar carrito de compra completo
- [ ] Confirmar reserva por email/SMS
- [ ] Galería visual de cortes
- [ ] FAQ interactivo
- [ ] Reseñas de clientes en chat
- [ ] Promociones automáticas por estación
- [ ] WhatsApp integration
- [ ] Notificaciones de recordatorio de cita

---

**¡A probar el bot, hermano! 💪 Si algo no entiende, avísame para mejorar.**
