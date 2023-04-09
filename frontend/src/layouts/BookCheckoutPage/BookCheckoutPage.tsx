import { useEffect, useState } from "react";
import { useOktaAuth } from "@okta/okta-react";
import BookModel from "../../models/BookModel";
import ReviewModel from "../../models/ReviewModel";
import SpinnerLoading  from "../Utils/SpinnerLoading";
import { StarsReview } from "../Utils/StarsReview";
import { CheckoutAndReviewBox } from "./CheckoutAndReviewBox";
import { LatestReviews } from "./LatestReviews";

export const BookCheckoutPage = () => {

    const { authState } = useOktaAuth();

    const [book, setBook] = useState<BookModel>();
    const [isLoading, setIsLoading] = useState(true);
    const [httpError, setHttpError] = useState(null);

    // review state
    const [reviews, setReviews] = useState<ReviewModel[]>([]);
    const [totalStars, setTotalStars] = useState(0);
    const [isLoadingReview, setIsLoadingReview] = useState(true);

    //loans count state
    const [currentLoansCount, setCurrentLoansCount] = useState(0);
    const [isLoadingLoansCount, setIsLoadingLoansCount] = useState(true);

    //is book check out
    const [isCheckedOut, setIsCheckedOut] = useState(false);
    const [isLoadingBookCheckout, setIsLoadingBookCheckout] = useState(true);

    const bookId = (window.location.pathname).split('/')[2];

    useEffect(() => {
        const fetchBook = async () => {
            const baseUrl: string = `http://localhost:8080/api/books/${bookId}`;

            const response = await fetch(baseUrl);

            if (!response.ok) {
                throw new Error('Something went wrong!');
            }

            const responseJson = await response.json();

            const loadedBook: BookModel = {
                id: responseJson.id,
                title: responseJson.title,
                author: responseJson.author,
                description: responseJson.description,
                copies: responseJson.copies,
                copiesAvailable: responseJson.copiesAvailable,
                category: responseJson.category,
                img: responseJson.img,
            };

            setBook(loadedBook);
            setIsLoading(false);
        };
        fetchBook().catch((error: any) => {
            setIsLoading(false);
            setHttpError(error.message);
        })
    }, [isCheckedOut]);

    useEffect(() => {
        const fetchReviews = async () => {
            const reviewUrl: string = `http://localhost:8080/api/reviews/search/findByBookId?bookId=${bookId}`;

            const response = await fetch(reviewUrl);

            if (!response.ok) {
                throw new Error('Something went wrong!');
            }

            const responseJson = await response.json();

            const responseData = responseJson._embedded.reviews;

            const loadedReviews: ReviewModel[] = [];

            let weightStartedReview = 0;

            for (const key in responseData) {
                loadedReviews.push({
                    id: responseData[key].id,
                    userEmail: responseData[key].userEmail,
                    date: responseData[key].date,
                    rating: responseData[key].rating,
                    book_id: responseData[key].bookId,
                    reviewDescription: responseData[key].reviewDescription
                });
                weightStartedReview += responseData[key].rating;
            }

            if(loadedReviews) {
                const round = (Math.round((weightStartedReview / loadedReviews.length) * 2) / 2 ).toFixed(1);
                setTotalStars(Number(round));
            }

            setReviews(loadedReviews);
            setIsLoadingReview(false);
        };

        fetchReviews().catch((error: any) => {
            setIsLoadingReview(false);
            setHttpError(error.message);
        })
    }, []);

    useEffect(() => {
        const fetchLoansCount = async () => {
            if(authState && authState.isAuthenticated) {
                const loansCountUrl: string = `http://localhost:8080/api/books/secure/currentloans/count`;

                const requestOptions = {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${authState.accessToken?.accessToken}`,
                        'Content-Type': 'application/json'
                    }
                }
                const currentLoansCountResponse = await fetch(loansCountUrl, requestOptions);
                if(!currentLoansCountResponse.ok) {
                    throw new Error('Something went wrong!');
                }
                const currentLoansCountResponseJson = await currentLoansCountResponse.json();
                setCurrentLoansCount(currentLoansCountResponseJson);
            }
            setIsLoadingLoansCount(false);
        }
        fetchLoansCount().catch((error: any) => {
            setIsLoadingLoansCount(false);
            setHttpError(error.message);
        })

    }, [authState, isCheckedOut]);

    useEffect(() => {
        const fetchUserCheckoutBook = async () => {
            if(authState && authState.isAuthenticated) {
                const url = `http://localhost:8080/api/books/secure/ischeckedout/byuser?bookId=${bookId}`;
                const requestOptions = {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${authState.accessToken?.accessToken}`,
                        'Content-Type': 'application/json'
                    }
                }
                const bookCheckedOut = await fetch(url, requestOptions);
                if(!bookCheckedOut.ok) {
                    throw new Error('Something went wrong!');
                }
                const bookCheckedOutJson = await bookCheckedOut.json();
                setIsCheckedOut(bookCheckedOutJson);
            }
            setIsLoadingBookCheckout(false);
        }
        fetchUserCheckoutBook().catch((error: any) => {
            setIsLoadingBookCheckout(false);
            setHttpError(error.message);
        })
    }, [authState]);

    if (isLoading || isLoadingReview || isLoadingLoansCount || isLoadingBookCheckout) {
        return (
            <SpinnerLoading />
        )
    }

    if (httpError) {
        return (
            <div className='container m-5'>
                <p>{httpError}</p>
            </div>
        )
    }

    async function checkoutBook() {
        const url = `http://localhost:8080/api/books/secure/checkout?bookId=${book?.id}`;
        const requestOptions = {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
                'Content-Type': 'application/json'
            }
        };
        const checkoutResponse = await fetch(url, requestOptions);
        if (!checkoutResponse.ok) {
            throw new Error('Something went wrong!');
        }
        setIsCheckedOut(true);
    }

    return (
        <div>
            <div className='container d-none d-lg-block'>
                <div className='row mt-5'>
                    <div className='col-sm-2 col-md-2'>
                        {book?.img ?
                            <img src={book?.img} width='226' height='349' alt='Book' />
                            :
                            <img src={require('./../../Images/BooksImages/book-luv2code-1000.png')} width='226'
                                height='349' alt='Book' />
                        }
                    </div>
                    <div className='col-4 col-md-4 container'>
                        <div className='ml-2'>
                            <h2>{book?.title}</h2>
                            <h5 className='text-primary'>{book?.author}</h5>
                            <p className='lead'>{book?.description}</p>
                            <StarsReview rating={totalStars} size={32}/>
                        </div>
                    </div>
                    <CheckoutAndReviewBox 
                        book={book} 
                        mobile={false} 
                        currentLoansCount={currentLoansCount} 
                        isAuthenticated={authState?.isAuthenticated}
                        isCheckedout={isCheckedOut}
                        checkoutBook={checkoutBook}
                    />
                </div>
                <hr />
                <LatestReviews reviews={reviews} bookId={book?.id} mobile={false} />
            </div>
            <div className='container d-lg-none mt-5'>
                <div className='d-flex justify-content-center align-items-center'>
                    {book?.img ?
                        <img src={book?.img} width='226' height='349' alt='Book' />
                        :
                        <img src={require('./../../Images/BooksImages/book-luv2code-1000.png')} width='226'
                            height='349' alt='Book' />
                    }
                </div>
                <div className='mt-4'>
                    <div className='ml-2'>
                        <h2>{book?.title}</h2>
                        <h5 className='text-primary'>{book?.author}</h5>
                        <p className='lead'>{book?.description}</p>
                        <StarsReview rating={totalStars} size={32}/>
                    </div>
                </div>
                <CheckoutAndReviewBox 
                    book={book} 
                    mobile={true} 
                    currentLoansCount={currentLoansCount} 
                    isAuthenticated={authState?.isAuthenticated}
                    isCheckedout={isCheckedOut}
                    checkoutBook={checkoutBook}
                />
                <hr />
                <LatestReviews reviews={reviews} bookId={book?.id} mobile />
            </div>
        </div>
    );
}