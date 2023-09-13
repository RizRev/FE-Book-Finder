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
  const [jumlahData,setJumlahData] = useState(0)
  const [currentPage,setCurrentPage] = useState(1)
  const [startIndex,setStartIndex] = useState(0)
  const maxResult = 12
  const [activeTab, setActiveTab] = useState('search');



  const handleInputChange = (event) => {
    setTitle(event.target.value)
  }

  const submit = async () => {
    setIsLoading(true)
    console.log('ini submit:', title,maxResult,startIndex)
    axios.get(`https://www.googleapis.com/books/v1/volumes?q={${title}}&maxResults=${maxResult}&startIndex=${startIndex}`)
    .then(res => {
      //setTitle('')
      setIsLoading(false)
      console.log('ini hasilnya :',res)
      if (res.data.totalItems == 0)
        {
            setData([])
            setJumlahData(0)
        } else {
            setJumlahData(res.data.totalItems)
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
            if (res.data.success == true) {
              alert('Berhasil Menambahkan dalam Favorite')
            } 
            getDatabase()
        }).catch(error => {
          alert(`Buku Sudah ada dalam Favorite`)
          console.log('Ini error catch',error)
        })
    } catch (error) {
        console.log(error)
    }
  }

  const getDatabase = async () => {
    try {
        setIsLoadingFavorite(true)
        console.log('Menjalankan get database')
        axios.get(`https://strange-petticoat-hare.cyclic.cloud/book/`)
        .then(res => {
            console.log('INI DATA DATABASE',res.data.data)
            setFavorite(res.data.data)
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
    const totalPages = Math.ceil(jumlahData / maxResult);

    const deleteFavorite = (id) => {
      try {
        console.log('menjalankan delete favorite')
        axios.delete(`https://strange-petticoat-hare.cyclic.cloud/book/${id}`)
        .then( res => {
          console.log('hasil delete' , res)
          alert('Berhasil Menghapus Buku dalam Favorite')
          getDatabase()
        })
      } catch (error) {
        
      }
    }

    const nextButton = () => {
      if (currentPage !== totalPages) {
        const newCurrentPage = currentPage + 1;
        const newStartIndex = startIndex + maxResult;
        console.log('ini start index baru',newStartIndex)
    
        setCurrentPage(newCurrentPage);
        setStartIndex(newStartIndex);
    
        // if (newStartIndex === startIndex) {
        //   submit();
        // }

        setTimeout(() => {
          // if (newStartIndex === startIndex + maxResult) {
            submit();
          // }
        }, 500);
      }
    }

    const beforeButton = () => {
      if (currentPage !== 1) {
        setCurrentPage(currentPage-1)
        setStartIndex(startIndex-(maxResult))
        submit()
      }
    }


  return (
    <>
    <h1>Book Finder</h1>
    <div className='tabs'
    style={{display:'flex',flexDirection:'row',gap:80,justifyContent:'center', marginBottom:100}}
    >
        <button
          class="button-89" role="button"
          onClick={() => setActiveTab('search')}
          // className={`tab ${activeTab === 'search' ? 'active' : ''}`}
        >
          Search
        </button>
        <button
          class="button-89" role="button"
          onClick={() => setActiveTab('favorite')}
          // className={`tab ${activeTab === 'favorite' ? 'active' : ''}`}
        >
          Favorite
        </button>
      </div>
    {activeTab === 'search' ? (
      <>
      <InputGroup style={{display: 'flex', gap: 20,justifyContent: 'center'}}>
        <input
        className='input'
        placeholder="Find Book ..."
        value={title}
        onChange={handleInputChange}
        />
        <button class="button-82-pushable" role="button"
          onClick={()=>{submit()
            // ,setCurrentPage(1),setStartIndex(0)
          }}
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
      <div>
        <h2>{`Menemukan judul buku sebanyak : ${jumlahData}`}</h2>
        <div className='flex'>
        {data.map((item)=>(
          <div key={item.id}>
            <Card className='kotak'>
            <Card.Img variant="top" style={{height:175}} src={item.volumeInfo.imageLinks?.thumbnail ? item.volumeInfo.imageLinks?.thumbnail : book} />
            <Card.Body style={{display:'flex',alignItems:'center',alignSelf:'center'}}>
            <Card.Title style={{color: 'black',textAlign:'center',fontWeight:'bold'}}>{item.volumeInfo?.title}</Card.Title>
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
      </div>
      }
      </>
    ) :
    (
      <>
        <button class="button-82-pushable" role="button"
          onClick={() => getDatabase()}
          disabled={isLoadingFavorite}
        >
            <span class="button-82-shadow"></span>
            <span class="button-82-edge"></span>
            <span class="button-82-front text">
            {isLoadingFavorite ? 'Loading...':'Refresh'}
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
          <button onClick={() => deleteFavorite(item.id)}>
            Delete Favorite
          </button>
        </Card>
        </div>
      ))}
      </div>
      </>
    )}
    </>
  )
}

export default Home

