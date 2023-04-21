export default `
	varying vec2 vUV;
	uniform float time;
	uniform float ratio;
	const float PI = 3.14159265359;

	void main(){
			vec3 color0 = vec3(1.0, 0.9, 0.9);
			vec3 color1 = vec3(0.9, 0.2, 0.6);
			float d0 = distance(vUV.y, 1.);
			vec3 fc = mix(color1, color0, d0);
			float d1 = (1.0-smoothstep(0.12, 0.5, distance(vUV.y, -0.2)));
			fc = mix(fc, vec3(1.0), d1);

			vec3 color2 = vec3(0.6, 0.2, 0.4);
			vec3 color3 = vec3(1.0, 0.2, 0.8);
			float d3= distance(vUV.x, 1.);

			fc = mix(fc, mix(mix(color2, vec3(1.0), d0*0.5), color3, d3), 1.0-d3);

			gl_FragColor = vec4(fc, 1.0);
	}`
