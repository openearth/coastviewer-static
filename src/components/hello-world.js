import {experimental, GeoJsonLayer} from 'deck.gl';
const {DeckGLJS, MapControllerJS} = experimental;

export default {
  name: 'HelloWorld',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    };
  },
  mounted() {
    console.log('mounted hello', experimental);
    let viewport = {
      latitude: 52,
      longitude: 4,
      zoom: 10,
      bearing: 0,
      pitch: 60
    };
    let deckgl = new DeckGLJS({
      // TODO EventManager should accept element id
      /* global document */
      canvas: document.getElementById('deck'),
      ...viewport,
      width: 300,
      height: 300,
      debug: true
    });
  },
  methods: {
    addDeck() {

    }
  }
};
