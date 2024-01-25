import axios from 'axios';
import * as d3 from 'd3'
import { load_wad } from '../doom/loaders';
import { read_lumps } from '../doom/lumps';

function main() {
    let $app = d3.select(".doom")
    let url = $app.attr("data-wad-url")
    let $progress = $app.append("pre")

    axios.get(url, {
        responseType: "arraybuffer",
        onDownloadProgress: (event) => {
            $progress.text(`Downloading ${url}... ${event.progress! * 100}%`)
        },
        transformResponse: (data) => load_wad(read_lumps(data))
    }).then((response) => {
        $progress.text(JSON.stringify(response.data))
    })
}

main()
