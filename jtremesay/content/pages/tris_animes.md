---
title: Tris animés
---
{% load vite %}

Un truc much en vanilla TS pour visualiser différents algos de tris.


{% vite 'front/main/sorts.ts' %}
<div id="app">
    <div>
        <label>
            <code>log2(</code>Nombre d'échantillons<code>)</code> :

            <input type="number" name="samples_count" min="1" max="10" value="6">
        </label>

        <label>
            <input type="button" name="reset" value="Reset">
        </label>

        <label>
            Jouer :
            <input type="checkbox" name="playback" checked>
        </label>
    </div>
    <table>
        <thead>
            <tr>
                <th>Algorithme</th>
                <th>Visualisation</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>
                    <a href="https://fr.wikipedia.org/wiki/Tri_%C3%A0_bulles">Bubble</a>
                </td>
                <td>
                    <canvas data-sort="bubble" width="640" height="480"></canvas>
                </td>
            </tr>
            <tr>
                <td>
                    <a href="https://en.wikipedia.org/wiki/Gnome_sort">Gnome</a>
                </td>
                <td>
                    <canvas data-sort="gnome" width="640" height="480"></canvas>
                </td>
            </tr>
            <tr>
                <td>
                    <a href="https://fr.wikipedia.org/wiki/Tri_par_insertion">Insertion</a>
                </td>
                <td>
                    <canvas data-sort="insertion" width="640" height="480"></canvas>
                </td>
            </tr>
            <tr>
                <td>
                    <a href="https://fr.wikipedia.org/wiki/Tri_pair-impair">Pair-Impair</a>
                </td>
                <td>
                    <canvas data-sort="oddeven" width="640" height="480"></canvas>
                </td>
            </tr>
        </tbody>
    </table>
</div>


Code source disponible [ici](https://github.com/jtremesay/jtremesay.org/blob/main/front/main/sorts.ts).
