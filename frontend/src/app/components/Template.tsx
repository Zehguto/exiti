import React from 'react';
import Image from 'next/image';


interface TemplateMainProps {
  children: React.ReactNode
}

export const TemplateMain: React.FC<TemplateMainProps> = (props: TemplateMainProps) => {
  return (
    <div className="min-h-screen flex flex-col">

    <Header />
    <main className="flex-grow container mx-auto p-4">
      {props.children}
    </main> 
    <Footer />

    </div >
  )
}

const Header: React.FC = () => {
  return (
<header className="p-0.1text-white bg-linear-to-r from-emerald-900 via-teal-600 to-green-400">
      {/* ... */}
      <div className="container mx-auto flex justify-between items-center">

        <div className="flex items-center space-x-7">
          <Image 
            src="/imagens/exitilogobranco.png" 
            alt="Logo Exiti Soluções Digitais" 
            width={100} 
            height={50}
            className="rounded-full" 
          />

        </div>

        <nav className="space-x-7 text-sm font-medium">
          <a href="#" className="hover:text-white transition-colors">Cadastros</a>
        </nav>
      </div>
    </header>
  )
}

const Footer: React.FC = () => {
    return (
        <footer className="p-4 text-white bg-linear-to-r from-emerald-900 via-teal-600 to-green-400">
        
            <div className="container mx-auto text-center">
                <p className="text-sm">
                    Jose Augusto Moreira Santos.
                </p>
            </div>
        </footer>
    )
}

const Formulario: React.FC = () => {
    return (
        <section className='flex flex-col items-center justify-center mt-10 mb-10'>
            <h2 className='text-2xl font-bold mb-4 text-gray-800'>Formulário de Cadastro</h2>
            <form className='w-full max-w-md bg-transparent p-6 rounded-lg shadow-md'>
                <div className='mb-4'>
                    <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='nome'>
                        Nome
                    </label>
                    <input
                        className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                        id='nome'
                        type='text'
                        placeholder='Digite seu nome'
                    />
                </div>
                <div className='mb-4'>
                    <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='email'>
                        Email
                    </label>
                    <input
                        className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                        id='email'
                        type='email'
                        placeholder='Digite seu email'
                    />
                </div>
                <div className='mb-4'>
                    <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='status'>
                        Status
                    </label>
                </div>
                <div className='flex items-center justify-between'>
                    <button
                        className='bg-linear-to-r from-emerald-900 via-teal-600 to-green-400 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'
                        type='submit'
                    >
                        Cadastrar
                    </button>
                </div>
            </form>
        </section>
    )
}