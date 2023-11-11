import Container from '@/components/container'
import Image from 'next/image'

export default function Home() {
  return (
    <Container>
      <div className='flex flex-col justify-center pt-[12rem]'>
        <p className=''>Starter blog</p>
        <h1 className='text-7xl'>Home Page</h1>
      </div>
    </Container>
  )
}
