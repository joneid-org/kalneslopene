package com.grimsgaards.kalneslopene.service

import io.minio.GetPresignedObjectUrlArgs
import io.minio.MinioClient
import io.minio.http.Method
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Service
import java.util.concurrent.TimeUnit

@Service
class S3Service(
    @Value("\${minio.endpoint}")
    private val minioEndpoint: String,
    @Value("\${minio.access-key}")
    private val minioAccessKey: String,
    @Value("\${minio.secret-key}")
    private val minioSecretKey: String,
    @Value("\${minio.bucket-name}")
    private val minioBucketName: String,
) {

    private val minioClient: MinioClient = MinioClient.builder()
        .endpoint(minioEndpoint)
        .credentials(minioAccessKey, minioSecretKey)
        .build()

    fun getPresignedUrl(fileName: String, expiryHours: Int = 1): String =
        minioClient.getPresignedObjectUrl(
            GetPresignedObjectUrlArgs.builder()
                .method(Method.GET)
                .bucket(minioBucketName)
                .`object`(fileName)
                .expiry(expiryHours, TimeUnit.HOURS)
                .build()
        )
}


