import { useEffect, useState } from 'react'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import book from './assets/Book.png'
import axios from 'axios';
import RatingStars from 'react-rating-stars-component';
import StarRatings from 'react-star-ratings';
import './Home.css'

function Home() {
  const [title, setTitle] = useState('')
  const [data, setData] = useState([])
  const [favorite,setFavorite] = useState([])
  const [isLoading,setIsLoading] = useState(false)
  const [isLoadingFavorite,setIsLoadingFavorite] = useState(false)


  const handleInputChange = (event) => {
    setTitle(event.target.value)
  }

  const submit = async () => {
    setIsLoading(true)
    console.log('ini submit:', title)
    axios.get(`https://www.googleapis.com/books/v1/volumes?q={${title}}`)
    .then(res => {
        setTitle('')
      setIsLoading(false)
      console.log('ini hasilnya :',res)
      if (res.data.totalItems == 0)
        {
            setData([])
        } else {
            setData(res.data.items)
        }
      // console.log('ini data : ',data.volumeInfo.averageRating)
    })
    .catch(error => {
        setTitle('')
        console.error('ini error : ',error)
        setIsLoading(false)
    })
  }
  const saveFavorite = async(item) => {
    try {
        const data = {
            id: item.id,
            title: item.volumeInfo.title,
            image: item.volumeInfo.imageLinks?.thumbnail ? item.volumeInfo.imageLinks.thumbnail : null,
            author: item.volumeInfo.authors ? item.volumeInfo.authors : 'Anonymous'
        }
        axios.post(`https://strange-petticoat-hare.cyclic.cloud/book`,data)
        .then(res => {
            console.log('INI RESPONSE : ',res)
            getDatabase()
        })
        // const response = await axios.post(`http://localhost:3000/book`,data)
        // console.log('INI RESPONSE : ',response)
        // getDatabase()
    } catch (error) {
        console.log(error)
    }
  }

  const getDatabase = async () => {
    try {
        setIsLoadingFavorite(true)
        console.log('Menjalankan get database')
        // const response = await axios.get(`http://localhost:3000/book/`)
        axios.get(`https://strange-petticoat-hare.cyclic.cloud/book/`)
        .then(res => {
            console.log('INI DATA DATABASE',res.data)
            setFavorite(res.data)
            setIsLoadingFavorite(false)
        })
        // console.log('INI DATA DATABASE',response.data)
        // setFavorite(response.data)
        // setIsLoadingFavorite(false)
    } catch (error) {
        console.log(error)
    }
}

    useEffect(() => {
        console.log('menjalankan useEffect')
        getDatabase()
    },[])

  return (
    <>
    <h1>Book Finder</h1>
    <button class="button-82-pushable" role="button"
          onClick={() => getDatabase()}
          disabled={isLoadingFavorite}
        >
            <span class="button-82-shadow"></span>
            <span class="button-82-edge"></span>
            <span class="button-82-front text">
            {isLoadingFavorite ? 'Loading...':'Favorite Book'}
            </span>
        </button>
        <div className='flex'>
      {favorite.map((item)=>(
        <div key={item.id}>
          <Card className='kotak'>
          <Card.Img variant="top" style={{height:175}} src={item.image === 'null' ? book : item.image} />
          <Card.Body style={{display:'flex',alignItems:'center',alignSelf:'center'}}>
          <Card.Title style={{color: 'black',textAlign:'center'}}>{item.title}</Card.Title>
          </Card.Body>
          <ListGroup.Item style={{color: 'black'}}>{item.author}</ListGroup.Item>
        </Card>
        </div>
      ))}
      </div>
      <InputGroup style={{display: 'flex', gap: 20,justifyContent: 'center'}}>
        <input
        className='input'
        placeholder="Find Book ..."
        value={title}
        onChange={handleInputChange}
        />
        <button class="button-82-pushable" role="button"
          onClick={submit}
          disabled={isLoading}
        >
            <span class="button-82-shadow"></span>
            <span class="button-82-edge"></span>
            <span class="button-82-front text">
            {isLoading ? 'Loading...':'Search'}
            </span>
        </button>
      </InputGroup>
      {data.length === 0 ? 
      <h1>Tidak ada judul buku tersebut</h1> 
      :
        <div className='flex'>
        {data.map((item)=>(
          <div key={item.id}>
            <Card className='kotak'>
            <Card.Img variant="top" style={{height:175}} src={item.volumeInfo.imageLinks?.thumbnail ? item.volumeInfo.imageLinks?.thumbnail : book} />
            <Card.Body style={{display:'flex',alignItems:'center',alignSelf:'center'}}>
            <Card.Title style={{color: 'black',textAlign:'center'}}>{item.volumeInfo?.title}</Card.Title>
            </Card.Body>
            <ListGroup className="list-group-flush">
              {item.volumeInfo.authors ? (item.volumeInfo.authors.map((authors) => (
                <ListGroup.Item style={{color: 'black'}}>{authors}</ListGroup.Item>
              ))) : <ListGroup.Item style={{color: 'black'}}>{'Anonymous'}</ListGroup.Item>}
            </ListGroup>
            <Card.Body>
            <StarRatings
              rating={item.volumeInfo?.averageRating ? item.volumeInfo?.averageRating : 0}
              starRatedColor="gold"
              numberOfStars={5}
              starDimension="20px"
              />
              <button onClick={() => saveFavorite(item)}>
                  simpan wishlist
              </button>
            </Card.Body>
          </Card>
          </div>
        ))}
        </div>
      }
    </>
  )
}

export default Home

