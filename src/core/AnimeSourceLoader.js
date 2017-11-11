export default class AnimeSourceLoader {

  constructor(url) {
    this.url = url;
  }

  loadSource() {
    return new Promise((success, failure) => {
      // Loading data here
      // console.log(this.url);
      fetch(this.url)
      .then((html) => html.text())
      .then((htmlText) => {
        var HTMLParser = require('fast-html-parser');
        
        var root = HTMLParser.parse(htmlText);
        var animeSources = root.querySelector('.anime_muti_link');
        // Somwhow it does not exist
        if (animeSources == null) success([]);
        var items = animeSources.childNodes[1].childNodes;
        var animeData = [];
        var length = items.length;
        // // Somwhow it does not have any sources
        if (length == 0) success([]);

        // Get download link
        var download = root.querySelector('.download-anime').childNodes[1].attributes.href;
        animeData.push({source: download, name: 'Download this episode'});

        for (var i = 0; i < length; i++) {
          var source = items[i];
          // Somehow, next line is parsed as well
          if (source.isWhitespace) continue;
          // console.log(source);
          var animeSource = source.childNodes[1].attributes["data-video"];
          var sourceName = source.removeWhitespace().rawText.replace('Choose this server', '');
          // The first source does not include https:
          if (!animeSource.startsWith('http')) animeSource = 'https:' + animeSource;
          animeData.push({source: animeSource, name: sourceName});
        }
        // console.log(animeData);
        success(animeData);
      })
      .catch((error) => {
        // console.error(error);
        failure(error);
      });
    })
  }
}