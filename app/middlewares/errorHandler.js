
export default function errorHandler(err, req, res, next) {
    console.log(err.stack);
    res.status(500).send('Upsi! Algo deu errado!');
}