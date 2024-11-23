#include simplexNoise4d.glsl
attribute vec3 tangent;

uniform float uTime;
uniform float uPositionFrequency;
uniform float uPositionStrength;
uniform float uTimeFrequency;

uniform float uSmallWavePositionFrequency;
uniform float uSmallWavePositionStrength;
uniform float uSmallWaveTimeFrequency;


float getBlob(vec3 position) {
    vec3 wrappedPosition = position;
    wrappedPosition += simplexNoise4d(vec4(position * uPositionFrequency, uTime * uTimeFrequency)) * uPositionStrength;

    return simplexNoise4d(vec4(wrappedPosition * uSmallWavePositionFrequency, uTime * uSmallWaveTimeFrequency)) * uSmallWavePositionStrength;
}

void main() {

    vec3 bitangent = cross(tangent.xyz, normal);

    float shift = 0.07;
    vec3 A = csm_Position + shift * tangent.xyz;
    vec3 B = csm_Position + shift * bitangent;

    float blob = getBlob(csm_Position);
    csm_Position += blob * normal;

    A += getBlob(A) * normal;
    B += getBlob(B) * normal;

    vec3 shadowA = normalize(A - csm_Position);
    vec3 shadowB = normalize(B - csm_Position);

    csm_Normal = -cross(shadowA, shadowB);
}