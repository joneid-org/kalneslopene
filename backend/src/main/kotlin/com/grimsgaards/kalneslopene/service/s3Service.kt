package com.grimsgaards.kalneslopene.service

import io.minio.GetPresignedObjectUrlArgs
import io.minio.MinioClient
import io.minio.http.Method
import org.springframework.stereotype.Service
import java.util.concurrent.TimeUnit

@Service
class S3Service {

    private val minioClient: MinioClient = MinioClient.builder()
        .endpoint("http://127.0.0.1:9000")
        .credentials("minioadmin", "minioadmin")
        .build()

    fun getPresignedUrl(bucketName: String, fileName: String, expiryHours: Int = 1): String =
        minioClient.getPresignedObjectUrl(
            GetPresignedObjectUrlArgs.builder()
                .method(Method.GET)
                .bucket(bucketName)
                .`object`(fileName)
                .expiry(expiryHours, TimeUnit.HOURS)
                .build()
        )
}


