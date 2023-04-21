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

	// The MIT License
	// Copyright © 2013 Inigo Quilez
	// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions: The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software. THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

	float hash(vec3 p)  // replace this by something better
	{
			p  = fract( p*0.3183099+.1 );
			p *= 17.0;
			return fract( p.x*p.y*p.z*(p.x+p.y+p.z) );
	}

	float noise( in vec3 x )
	{
			vec3 i = floor(x);
			vec3 f = fract(x);
			f = f*f*(3.0-2.0*f);
			
			return mix(mix(mix( hash(i+vec3(0,0,0)), 
													hash(i+vec3(1,0,0)),f.x),
									mix( hash(i+vec3(0,1,0)), 
													hash(i+vec3(1,1,0)),f.x),f.y),
							mix(mix( hash(i+vec3(0,0,1)), 
													hash(i+vec3(1,0,1)),f.x),
									mix( hash(i+vec3(0,1,1)), 
													hash(i+vec3(1,1,1)),f.x),f.y),f.z);
	}

	vec2 hash( in vec2 x )  // replace this by something better
{
	const vec2 k = vec2( 0.3183099, 0.3678794 );
	x = x*k + k.yx;
	return -1.0 + 2.0*fract( 16.0 * k*fract( x.x*x.y*(x.x+x.y)) );
}

mat3 m3 = mat3( 0.00,  0.80,  0.60,
						-0.80,  0.36, -0.48,
						-0.60, -0.48,  0.64 );

float flow(in vec3 p, in float t)
{
float z=2.;
float rz = 0.;
vec3 bp = p;
for (float i= 1.;i < 2.;i++ )
{
	p += time*.1;
	rz+= (sin(noise(p+t*0.8)*6.)*0.5+0.5) /z;
	p = mix(bp,p,0.6);
	z *= 2.;
	p *= 2.01;
			p*= m3;
}
return rz;	
}

	#define UVSPLIT 3.
	#define SUBSTEP (vec2(1.)/UVSPLIT)
	#define FRAMES (UVSPLIT*UVSPLIT)

	void main(){
			vec2 p = vUV*UVSPLIT;
			vec2 cell = floor(p);     
			float idx = (cell.x+(cell.y*UVSPLIT));       
			p = (p-cell)*2.0-1.0;       
			float totalA = 0.0;
			float framePos = idx/FRAMES;
			vec3 finalColor = vec3(1.0);
			vec3 np0 = vec3(p.xy, time*0.8)*10.1;
			np0.z+=(idx*0.5)+time;
			float n0 = flow(np0, time*0.01);
			float f0 = (framePos*0.8)+0.2;
			float f1 = pow(1.0-(abs(distance(idx, 1.))/FRAMES), 1.5);
			
			float d0 = 1.0-(distance(idx, 9.0)/FRAMES);
			float c0 = circleLine(p, 0.1+(n0*0.1)+(f0*0.5), 0.1+(n0*0.25), 0.5);
			c0*=f1*((d0*0.8)+0.1);
			c0 = smoothstep(0.0, 0.6, c0);
			totalA = max(totalA, c0);

			float c1 = circleLine(p, 0.1+(f0*0.5)*d0, 0.01+(f0*0.05), 1.0+(f0*10.));
			c1*=(f1*2.0)*((d0*0.5)+0.9);
			totalA = max(c1, totalA);

			float c2 = circle(p, (1.5*d0)+0.001, 2.0);
			c2*=(1.0-(d0*0.9));
			totalA = max(c2, totalA);

			float c3 = circle(p, (0.2*d0)+0.005, 6.0);
			c3*=(1.0-(d0*0.95));

			totalA = max(c3, totalA);

			float c4 = circleLine(p, sin(framePos*PI)*0.3, 0.1, 1.0+(d0*10.)); 
			c4*=1.0-(d0*0.5);
			totalA = max(c4, totalA);

			float outline = circleLine(p*((n0*0.5)+(1.0-(f0*1.6))), 0.1, 0.01+(n0*0.25), 0.2);
			outline *= c2*5.;
			outline *= 1.0-(d0*0.6);
			totalA = max(outline, totalA);
		
			vec3 colorBase = vec3(1.0, 0.0, 0.5);
			colorBase = mix(colorBase, vec3(1.0), c1);
			colorBase = mix(colorBase, vec3(0.4,0.4,0.9), c2);
			colorBase = mix(colorBase, vec3(1.0), c3);
			colorBase = mix(colorBase, vec3(1.0, 0.5, 0.5), c4);
			colorBase = mix(colorBase, mix(vec3(1.0, 0.0, 0.5), vec3(0.0,0.5,0.0), sin(-framePos*PI*2.)), outline);

			for(float i=0.; i<3.; i++){
					float pulseRing = circleLine(p*abs(cos(i+1.)*2.5), (0.9*d0)+0.1, 0.05, 1.0+(d0*6.)); 
					pulseRing*=(1.0-(d0*0.9));
					totalA = max(pulseRing, totalA);
					colorBase = mix(colorBase, vec3(1.0,1.0,1.0), pulseRing);
			}

			if(idx==0.){
					totalA*=0.45;
			}
			if(idx==1.){
					totalA*=0.35;
			}

			gl_FragColor = vec4(vec3(colorBase),totalA);
	}`
