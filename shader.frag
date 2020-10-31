precision mediump float;

varying vec2 vTexCoord;

uniform sampler2D displacement;
uniform sampler2D horror;
uniform float time;
uniform float displacementMult;

void main() {
  // invert y axis to match source axis orientation
  vec2 uv = vTexCoord;
  uv.y = 1.0 - uv.y;
  
  float displacementSample =  
    0.15 * displacementMult * texture2D(displacement, vec2(uv.y, uv.x)).r - 0.03;
  
  vec4 color_overlay = vec4(
    sin(sin(uv.x)*3.14 + time*0.000515)*0.6 + 0.4,
    sin(cos(uv.y)*3.14 + time*0.000137)*0.6 + 0.4,
    sin(time*0.05)*0.2 + 0.8,
    1);
  
  vec4 base_layer = vec4(
    texture2D(horror, uv + displacementSample).r,
    texture2D(horror, uv + displacementSample).g,
    texture2D(horror, uv + displacementSample).b,
    1);
    
  vec4 overlaid = min(base_layer, color_overlay);
                            
  // ouput
  gl_FragColor = overlaid;
  // gl_FragColor = texture2D(displacement, uv);
}