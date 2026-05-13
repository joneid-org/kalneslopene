package com.grimsgaards.kalneslopene.controller

import org.springframework.stereotype.Controller
import org.springframework.web.bind.annotation.RequestMapping

@Controller
class SpaController {
    @RequestMapping(value = ["/{path:[^\\.]*}", "/**/{path:[^\\.]*}"])
    fun forward(): String = "forward:/index.html"
}
