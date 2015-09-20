(function () {
  'use strict';

  const defaultSource =
`
precision highp float;
precision highp int;

void main(void) {
  gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
}
`
;

  class FragmentShader extends Shader {
    constructor (source) {
      source = source || defaultSource;
      super(Shader.types.FRAGMENT, source);
    }
  }

  window.FragmentShader = FragmentShader;
})();
