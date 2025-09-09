import { OverlayView } from "@react-google-maps/api";

export default function CustomMarker({ position, imgUrl }: { position: google.maps.LatLngLiteral; imgUrl: string }) {
  return (
    <OverlayView position={position} mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}>
      <div className="flex flex-col items-center">
        <img
          src={imgUrl}
          alt="marker"
          className="w-12 h-12 rounded-full border-2 border-white shadow-lg"
        />
      </div>
    </OverlayView>
  );
}