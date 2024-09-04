import {LinkContainer} from "react-router-bootstrap"
import {Table,Row,Col,Button} from 'react-bootstrap'
import Message from "../../components/Message"
import Loader from "../../components/Loader";
import {FaTrash,FaEdit} from "react-icons/fa";
import {toast} from "react-toastify";
import { useGetProductsQuery,useCreateProductMutation,useDeleteProductMutation } from "../../slices/productApislice";
import {useParams} from 'react-router-dom';
import Paginate from "../../components/Paginate";

const ProductListScreen = () => {
    const {pageNumber} = useParams();

    const {data, isLoading, error, refetch} = useGetProductsQuery({pageNumber});

    const [createProduct, {isLoading: loadingCreateProduct}] = useCreateProductMutation();

    const [deleteProduct ,{isLoading: loadingDelete} ] = useDeleteProductMutation();

    const deleteHandler = async(id) => {
        if(window.confirm("Are you sure you want to delete this product?")){
            try {
                await deleteProduct(id).unwrap();
                toast.success('Product deleted');
                refetch();
            } catch (err) {
                toast.error(err?.data?.message || err.error);
            }
        }
    }

    const createProductHandler = async() => {
        if(window.confirm('Are you sure you want to create a new product?')){
            try {
                await createProduct();
                refetch();
            } catch (err) {
                toast.error(err?.data?.message || err.error);
            }
        }
    }


  return (
    <>
        <Row className="align-items-center">
            <Col>
                <h1>Products</h1>
            </Col>
            <Col className="text-end">
                <Button className="btn-sm m-3" onClick={createProductHandler}>
                    <FaEdit /> Create Product
                </Button>
            </Col>
        </Row>

        {loadingCreateProduct && <Loader/>}
        {loadingDelete && <Loader/>}

        {isLoading ? <Loader /> : error ? <Message variant='danger'>{error.data.message}</Message> : (
            <>
                <Table striped responsive hover className="table-sm">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>NAME</th>
                            <th>PRICE</th>
                            <th>CATEGORY</th>
                            <th>BRAND</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.products.map((product) => (
                            <tr key={product._id}>
                                <td>{product._id}</td>
                                <td>{product.name}</td>
                                <td>{product.price}</td>
                                <td>{product.category}</td>
                                <td>{product.brand}</td>
                                <td>
                                    <LinkContainer to={`/admin/product/${product._id}/edit`}>
                                        <Button variant="light" className="btn-sm mx-2">
                                            <FaEdit />
                                        </Button>
                                    </LinkContainer>
                                    <Button className="btn-sm" variant="secondary"
                                    onClick={() => deleteHandler(product._id)}>
                                        <FaTrash style={{color: 'white'}}/>
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
                <Paginate page={data.page} pages={data.pages} isAdmin={true} />
            </>
        ) }
    </>
  )
}

export default ProductListScreen