// src/shader-chunks.js
/* eslint-disable no-undef */
import * as THREE from 'three';

// Add missing shader chunk
THREE.ShaderChunk.colorspace_fragment = `
#ifdef OECF
	gl_FragColor.rgb = OECF(gl_FragColor.rgb);
#endif
`;