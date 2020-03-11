class OutlinePipeline extends Phaser.Renderer.WebGL.Pipelines.TextureTintPipeline {
	constructor(game: Phaser.Game) {
		let config = {game: game,
			renderer: game.renderer,
			fragShader: `
			precision mediump float;

			uniform sampler2D uMainSampler;
			uniform float tex_size;

			varying vec2 outTexCoord;
			
			void main(void) {
				float factor = 1.0 / tex_size;

				vec4 color  = texture2D(uMainSampler, outTexCoord);
				vec4 colorU = texture2D(uMainSampler, vec2(outTexCoord.x, outTexCoord.y + factor));
				vec4 colorD = texture2D(uMainSampler, vec2(outTexCoord.x, outTexCoord.y - factor));
				vec4 colorL = texture2D(uMainSampler, vec2(outTexCoord.x + factor, outTexCoord.y));
				vec4 colorR = texture2D(uMainSampler, vec2(outTexCoord.x - factor, outTexCoord.y));
				
				if (color.a == 0.0 && (colorU.a != 0.0 || colorD.a != 0.0 || colorL.a != 0.0 || colorR.a != 0.0)  ) {
					gl_FragColor = vec4(1.0, 1.0, 1.0, .2);
				}
				else {
					if (color.a == 0.0) discard;
					color += vec4(0.1, 0.1, 0.1, 0);
					gl_FragColor = color;
				}
				
			}`
		};
		super(config);
	}
}
