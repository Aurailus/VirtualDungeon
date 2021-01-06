import * as Phaser from 'phaser';

export default class BrightenPipeline extends Phaser.Renderer.WebGL.Pipelines.SinglePipeline {
	constructor(game: Phaser.Game) {
		super({
			game: game,
			fragShader: `
 			precision mediump float;

 			uniform sampler2D uMainSampler;

 			varying vec2 outTexCoord;
			
 			void main(void) {
 				vec4 color  = texture2D(uMainSampler, outTexCoord);
 				if (color.a == 0.0) discard;
 				color += vec4(0.2, 0.2, 0.2, 0);
 				gl_FragColor = color;
 			}`
		});
	}
}
