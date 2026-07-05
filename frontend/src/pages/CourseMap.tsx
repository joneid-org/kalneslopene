import { CourseMapPins } from "@/components/CourseMap/CourseMapPins.tsx";
import { RoutePhotoGallery } from "@/components/CourseMap/RoutePhotoGallery.tsx";

export function CourseMap() {
  return (
    <div className="page-content flex flex-col gap-5 md:gap-6">
      <div>
        <h1 className="page-title">Løypekart</h1>
        <p className="page-subtitle mt-1">
          Klikk på en pin i kartet for å se informasjon om stedet langs ruten.
        </p>
      </div>

      <CourseMapPins />

      <RoutePhotoGallery />
    </div>
  );
}
