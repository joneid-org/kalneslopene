package com.grimsgaards.kalneslopene

import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/races")
class RaceController {

    @GetMapping
    fun getRaces(): String {
        return "Race endpoint works!"
    }
}
