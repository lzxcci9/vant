import { nextTick } from 'vue';
import { inBrowser, mountComponent } from '../utils';
import VanImagePreview from './ImagePreview';

let instance;

const defaultConfig = {
  loop: true,
  images: [],
  maxZoom: 3,
  minZoom: 1 / 3,
  onScale: null,
  onClose: null,
  onChange: null,
  teleport: 'body',
  className: '',
  showIndex: true,
  closeable: false,
  closeIcon: 'clear',
  asyncClose: false,
  startPosition: 0,
  swipeDuration: 500,
  showIndicators: false,
  closeOnPopstate: true,
  closeIconPosition: 'top-right',
};

function initInstance() {
  ({ instance } = mountComponent({
    data() {
      return {
        props: {
          show: false,
        },
      };
    },
    methods: {
      close() {
        this.toggle(false);
      },
      toggle(show) {
        this.props.show = show;
      },
      setProps(props) {
        Object.assign(this.props, props);
      },
      onClosed() {
        this.props.images = [];
      },
    },
    render() {
      return (
        <VanImagePreview
          {...{
            ...this.props,
            onClosed: this.onClosed,
            'onUpdate:show': this.toggle,
          }}
        />
      );
    },
  }));
}

const ImagePreview = (images, startPosition = 0) => {
  /* istanbul ignore if */
  if (!inBrowser) {
    return;
  }

  if (!instance) {
    initInstance();
  }

  const options = Array.isArray(images) ? { images, startPosition } : images;

  instance.setProps({
    ...defaultConfig,
    ...options,
  });

  nextTick(() => {
    instance.toggle(true);
  });

  return instance;
};

ImagePreview.Component = VanImagePreview;

ImagePreview.install = (app) => {
  app.use(VanImagePreview);
};

export default ImagePreview;
