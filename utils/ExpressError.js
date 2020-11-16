class ExpressError extends Error{
    cunstructor(message, statusCode){
        this.message = message
        this.statusCode = statusCode
    }
}

module.exports = ExpressError

