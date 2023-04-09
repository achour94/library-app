package com.achour.springbootlibrary.controller;

import com.achour.springbootlibrary.requestmodels.ReviewRequest;
import com.achour.springbootlibrary.service.ReviewService;
import com.achour.springbootlibrary.utils.ExtractJWT;
import org.springframework.web.bind.annotation.*;

@CrossOrigin("http://localhost:3000")
@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    private ReviewService reviewService;

    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    @GetMapping("/secure/user/book")
    public Boolean reviewBookByUser(@RequestHeader("Authorization") String token, @RequestParam Long bookId) throws Exception {
        String userEmail = ExtractJWT.payloadJWTExtraction(token, "\"sub\"");
        if (userEmail == null)
            throw new Exception("You are not authorized to perform this action");
        return reviewService.userReviewListed(userEmail, bookId);
    }

    @PostMapping("/secure")
    public void postReview(@RequestHeader("Authorization") String token, @RequestBody ReviewRequest reviewRequest) throws Exception {
        String userEmail = ExtractJWT.payloadJWTExtraction(token, "\"sub\"");
        if (userEmail == null)
            throw new Exception("You are not authorized to perform this action");
        reviewService.postReview(userEmail, reviewRequest);
    }
}
