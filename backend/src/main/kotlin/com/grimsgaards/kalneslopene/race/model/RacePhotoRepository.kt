package com.grimsgaards.kalneslopene.race.model

import com.grimsgaards.kalneslopene.race.RacePhotoKey
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.stereotype.Repository
import java.util.UUID

@Repository
interface RacePhotoRepository : JpaRepository<RacePhotoEntity, RacePhotoKey> {
    fun findAllByRaceUuidOrderByOrderIndexAsc(raceUuid: UUID): List<RacePhotoEntity>

    @Query(
        """
        select f.uuid from RacePhotoEntity rp join rp.photo p, FileEntity f
        where rp.race.uuid = :raceUuid and p.uuid in :photoUuids
            and (f = p.photoFile or f = p.thumbnailFile)
        """,
    )
    fun findFileUuidsOfPhotos(
        raceUuid: UUID,
        photoUuids: Collection<UUID>,
    ): List<UUID>
}
