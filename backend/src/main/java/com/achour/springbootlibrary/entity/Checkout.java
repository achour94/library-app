package com.achour.springbootlibrary.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "checkout")
@Data
public class Checkout {

    public Checkout() {
    }

    public Checkout(String userEmail,String checkoutDate, String returnDate, Long bookId) {
        this.userEmail = userEmail;
        this.bookId = bookId;
        this.checkoutDate = checkoutDate;
        this.returnDate = returnDate;
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "user_email")
    private String userEmail;

    @Column(name = "book_id")
    private Long bookId;

    @Column(name = "checkout_date")
    private String checkoutDate;

    @Column(name = "return_date")
    private String returnDate;
}
