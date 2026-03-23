/**
 * P-07: GPS 출퇴근 인증 — Geofence 서비스
 * Haversine 공식으로 두 좌표 간 거리 계산
 */

export interface Geofence {
  name: string;
  lat: number;
  lng: number;
  radiusMeters: number;
}

export interface LocationValidation {
  valid: boolean;
  nearestFence: string;
  distance: number; // meters
}

/**
 * Haversine 공식: 두 좌표 간 거리 (미터)
 */
function haversineDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6_371_000; // 지구 반지름 (미터)
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * 위치 검증: 주어진 좌표가 geofence 범위 내인지 확인
 * @param lat 사용자 위도
 * @param lng 사용자 경도
 * @param geofences 고객사에 설정된 geofence 배열
 * @returns LocationValidation
 */
export function validateLocation(
  lat: number,
  lng: number,
  geofences: Geofence[]
): LocationValidation {
  if (geofences.length === 0) {
    return { valid: true, nearestFence: "없음", distance: 0 };
  }

  let nearestFence = geofences[0].name;
  let minDistance = Infinity;

  for (const fence of geofences) {
    const dist = haversineDistance(lat, lng, fence.lat, fence.lng);
    if (dist < minDistance) {
      minDistance = dist;
      nearestFence = fence.name;
    }
    if (dist <= fence.radiusMeters) {
      return { valid: true, nearestFence: fence.name, distance: Math.round(dist) };
    }
  }

  return { valid: false, nearestFence, distance: Math.round(minDistance) };
}
