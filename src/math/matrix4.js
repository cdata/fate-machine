import { Vector3 } from './vector3';

const radianFactor = Math.PI / 180;

const xLook = new Vector3();
const yLook = new Vector3();
const zLook = new Vector3();

/** Note: Matrix elements represented in row-major format **/

class Matrix4 {

  static stringFormat (tokens, ...params) {
    return tokens.reduce((result, token, index) => {
      result += token;
      if (params[index] !== undefined) {
        if (params[index] >= 0) {
          result += ' ' + params[index].toFixed(16).substr(0, 15);
        } else {
          result += params[index].toFixed(16).substr(0, 16);
        }
      }
      return result;
    }, '');
  }

  constructor (
    e00, e01, e02, e03,
    e04, e05, e06, e07,
    e08, e09, e10, e11,
    e12, e13, e14, e15
  ) {
    this.elements = new Float32Array(16);

    if (e00 === undefined) {
      this.identity();
    } else {
      this.set(
        e00, e01, e02, e03,
        e04, e05, e06, e07,
        e08, e09, e10, e11,
        e12, e13, e14, e15
      );
    }
  }

  set (
    e00, e01, e02, e03,
    e04, e05, e06, e07,
    e08, e09, e10, e11,
    e12, e13, e14, e15
  ) {
    let m = this.elements;

    m[0 ] = e00 || 0; m[4 ] = e04 || 0; m[8 ] = e08 || 0; m[12] = e12 || 0;
    m[1 ] = e01 || 0; m[5 ] = e05 || 0; m[9 ] = e09 || 0; m[13] = e13 || 0;
    m[2 ] = e02 || 0; m[6 ] = e06 || 0; m[10] = e10 || 0; m[14] = e14 || 0;
    m[3 ] = e03 || 0; m[7 ] = e07 || 0; m[11] = e11 || 0; m[15] = e15 || 0;

    return this;
  }

  identity () {
    return this.set(
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1
    );
  }

  copy (other) {
    let m = other.elements;

    return this.set(
      m[0 ], m[1 ], m[2 ], m[3 ],
      m[4 ], m[5 ], m[6 ], m[7 ],
      m[8 ], m[9 ], m[10], m[11],
      m[12], m[13], m[14], m[15]
    );
  }

  multiplyScalar (scalar) {
    let m = this.elements;

    return this.set(
      m[0 ] * scalar, m[1 ] * scalar, m[2 ] * scalar, m[3 ] * scalar,
      m[4 ] * scalar, m[5 ] * scalar, m[6 ] * scalar, m[7 ] * scalar,
      m[8 ] * scalar, m[9 ] * scalar, m[10] * scalar, m[11] * scalar,
      m[12] * scalar, m[13] * scalar, m[14] * scalar, m[15] * scalar
    );
  }

  clone () {
    let m = this.elements;

    return new Matrix4(
      m[0 ], m[1 ], m[2 ], m[3 ],
      m[4 ], m[5 ], m[6 ], m[7 ],
      m[8 ], m[9 ], m[10], m[11],
      m[12], m[13], m[14], m[15]
    );
  }

  lookAt (eye, target, up) {
    let m = this.elements;

    zLook.copy(eye).subtract(target).normalize();

    if (zLook.length === 0) {
      zLook.z = 1;
    }

    xLook.copy(up).cross(zLook).normalize();

    if (xLook.length === 0) {
      zLook.x += 0.0001;
      xLook.copy(up).cross(zLook).normalize();
    }

    yLook.copy(zLook).cross(xLook);

    return this.set(
      xLook.x, xLook.y, xLook.z, m[12],
      yLook.x, yLook.y, yLook.z, m[13],
      zLook.x, zLook.y, zLook.z, m[14],
      m[3],    m[7],    m[11],   m[15]
    );
  }

  frustum (left, right, bottom, top, near, far) {
    let x = 2 * near / (right - left);
    let y = 2 * near / (top - bottom);

    let a = (right + left) / (right - left);
    let b = (top + bottom) / (top - bottom);
    let c = - (far + near) / (far - near);
    let d = -2 * far * near / (far - near);

    return this.set(
      x,  0,  0,  0,
      0,  y,  0,  0,
      a,  b,  c, -1,
      0,  0,  d,  0
    );
  }

  perspective (fov, aspect, near, far) {
    let fovRad = fov / 2 * radianFactor;
    let yMax = near * Math.tan(fovRad);
    let yMin = -yMax;
    let xMax = yMax * aspect;
    let xMin = yMin * aspect;

    return this.frustum(xMin, xMax, yMin, yMax, near, far);
  }

  translate (vector) {
    let m = this.elements;
    let x = vector.x;
    let y = vector.y;
    let z = vector.z || 0;

    m[12] = m[0 ] * x + m[4 ] * y + m[8 ] * z + m[12];
    m[13] = m[1 ] * x + m[5 ] * y + m[9 ] * z + m[13];
    m[14] = m[2 ] * x + m[6 ] * y + m[10] * z + m[14];
    m[15] = m[3 ] * x + m[7 ] * y + m[11] * z + m[15];

    return this;
  }

  rotate (quaternion) {
    let m = this.elements;
    let x = quaternion.x;
    let y = quaternion.y;
    let z = quaternion.z;
    let w = quaternion.w;
    let x2 = x + x;
    let y2 = y + y;
    let z2 = z + z;
    let xx = x * x2;
    let xy = x * y2;
    let xz = x * z2;
    let yx = y * x2;
    let yy = y * y2;
    let yz = y * z2;
    let zx = z * x2;
    let zy = z * y2;
    let zz = z * z2;
    let wx = w * x2;
    let wy = w * y2;
    let wz = w * z2;


    return this.set(
      1 - (yy + zz), xy + wz,       xz - wy,       m[3 ],
      xy - wz,       1 - (xx + zz), yz + wx,       m[7 ],
      xz + wy,       yz - wx,       1 - (xx + yy), m[11],
      m[12],         m[13],         m[14],         m[15]
    );
  }

  toString () {
    let m = this.elements;

    return (
      Matrix4.stringFormat`
| ${m[0 ]} ${m[4 ]} ${m[8 ]} ${m[12]}  |
| ${m[1 ]} ${m[5 ]} ${m[9 ]} ${m[13]}  |
| ${m[2 ]} ${m[6 ]} ${m[10]} ${m[14]}  |
| ${m[3 ]} ${m[7 ]} ${m[11]} ${m[15]}  |
`
    );
  }
}

export { Matrix4 };
