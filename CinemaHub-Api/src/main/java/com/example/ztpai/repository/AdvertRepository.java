package com.example.ztpai.repository;

import com.example.ztpai.entity.Advert;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface AdvertRepository extends JpaRepository<Advert, UUID> {
}
