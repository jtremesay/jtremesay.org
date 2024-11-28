---
title: Text nodes!
slug: textnodes
---
{% load static %}
{% load django_vite %}
{% vite_asset 'jtremesay/front/main/textnodes.ts' %}

Padawan, mon ancien alternant, est en train de créer un effet rudement chouette pour son futur site pro ! J'essaye de le reproduire parce que je le trouve super cool et ingénieux :D

**TODO**: Insérer lien vers le site de Padawan quand il sera en ligne

J'appelle ça un «textnode» parce que dans la version originel de Padawan, les points composants les lettres sont interconnectés par des lignes, ce qui donne un effet de nœuds d'un graphe reliés par des arrêtes. Mais j'ai surtout été interessé par reproduire l'effet de "dithering", donc j'ai pas tout refait.

Mais y'a quand même une chouette animation quand vous passez la souris sur le texte ! (marche bof sur mobile)

<input id="textnodes-input" value="Hello, world">
<canvas id="textnodes-canvas-text">

Sa solution pour générer le dithering est simple et ingénieuse. Il dessine le texte dans un canvas headless, récupère l'image data associé, et lit les pixels pour chercher ceux définis. En plus, ça marche aussi avec autre chose que du texte. N'importe quoi rendu dans un canvas peut être utilisé pour générer des points !

<canvas id="textnodes-canvas-demo">

Voici mon implémentation en TypeScript :

```typescript
function generate_nodes_from_text(text: string) : [number, number, [number, number][]] {
    const font = "30px Arial";

    // Create the headless canvas
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d")!;

    // Get the size of the bounding box
    ctx.font = font;
    const textMetrics = ctx.measureText(text);
    const width = Math.ceil(textMetrics.width);
    const height = Math.ceil(textMetrics.actualBoundingBoxAscent + textMetrics.actualBoundingBoxDescent);

    // Resize the canvas to the bounding box
    canvas.width = width;
    canvas.height = height;

    // Draw the text
    ctx.font = font;
    ctx.fillStyle = "black";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text, width / 2, height / 2);

    // Read the pixels
    const imageData = ctx.getImageData(0, 0, width, height);
    const pixels_data = imageData.data;
    const pixels: [number, number][] = [];
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const index = (y * width + x) * 4;
            const r = pixels_data[index];
            const g = pixels_data[index + 1];
            const b = pixels_data[index + 2];
            const a = pixels_data[index + 3];
            // Fun fact: firefox use the alpha channel
            // instead of the rgb channels to render the text
            // so basically, all pixels are (0, 0, 0, a)
            // where a is the alpha value of the pixel
            // No idea if this tricks is used by the other browsers.
            // So we just filter on any non null channel value
            const val = Math.max(r, g, b, a);
            if (val > 0) {
                pixels.push([x, y]);
            }
        }
    }

    return [width, height, pixels];
}


function draw_nodes(ctx: CanvasRenderingContext2D, pixels: [number, number][]): void {
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    ctx.beginPath();
    ctx.fillStyle = "black";
    for (const pixel of pixels) {
        // Draw circles
        const x = pixel[0] * 10 + 5;
        const y = pixel[1] * 10 + 5;
        ctx.moveTo(x, y);
        ctx.arc(x, y, 5, 0, 2 * Math.PI);
    }
    ctx.fill();
}

function main() {
    const text = "Hello, World!";
    const [width, height, pixels] = generate_nodes_from_text(text);

    const canvas = document.querySelector("#my-canvas") as HTMLCanvasElement;
    canvas.width = width;
    canvas.height = height;
    document.body.appendChild(canvas);

    const ctx = canvas.getContext("2d")!;
    draw_nodes(ctx, pixels);
}
```

Là, l'affichage est fait dans un canvas parce que je tiens à avoir un bon framerate dans les animations. Mais si on uniquement interéssé par l'effet de dithering, il est possible de générer un SVG à la place. C'est plus léger pour le navigateure, mais limite potenetiellement les possibilités d'animation.

**TODO**: Insérer une démo d'un rendu svg