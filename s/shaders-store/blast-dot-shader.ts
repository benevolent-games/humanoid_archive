export default `
	varying vec2 vUV;
	uniform float time;
	uniform float ratio;
	const float PI = 3.14159265359;

	//https://www.iquilezles.org/www/articles/distfunctions2d/distfunctions2d.htm
	
	float sdCircle( vec2 p, float r )
	{
			return length(p) - r;
	}

	float circleLine( vec2 p, float r, float t, float aa ){
			float c = abs(sdCircle(p,r))/t;
			return 1.-smoothstep(r-(r*aa),r+(r*aa),dot(c,c)*4.0);
	}

	//And ShaderBook
	float circle(in vec2 _st, in float _radius, in float _aa){
			vec2 dist = _st;
			return 1.-smoothstep(_radius-(_radius*_aa),
													_radius+(_radius*_aa),
													dot(dist,dist)*4.0);
	}
	#define UVSPLIT 3.
	#define SUBSTEP (vec2(1.)/UVSPLIT)
	#define FRAMES (UVSPLIT*UVSPLIT)    
	void main(){
			vec2 p = vUV*UVSPLIT;
			vec2 cell = floor(p);     
			float idx = (cell.x+(cell.y*UVSPLIT));       
			p = (p-cell)*2.0-1.0;
			float framePos = idx/FRAMES;
			float c0 = circle(p, 0.5, 1.0);
			float c1 = circle(p, 0.8, 2.0);
			vec3 color = mix(vec3(1.0, 0.2, 0.5), vec3(1.0), c1);        
			color =  mix(color, vec3(1.0), c0);
			float a = ((c1*0.8)-(c0*0.3)+((c0*c0*c0)*0.3))*(1.-framePos);
			gl_FragColor = vec4(color,a);
	}`
