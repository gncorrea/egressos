import React from 'react'
import { Facebook, Instagram, Linkedin, Mail, Phone, MapPin, ExternalLink } from 'lucide-react'

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Informações da UEMG */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-lg font-semibold mb-4">
              Sistema de Gestão de Egressos - UEMG
            </h3>
            <p className="text-gray-300 mb-4">
              Conectando egressos da Universidade do Estado de Minas Gerais, 
              promovendo networking e acompanhando o desenvolvimento profissional 
              de nossa comunidade acadêmica.
            </p>
            <div className="space-y-2 text-sm text-gray-300">
              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-2" />
                <span>Rodovia Papa João XXIII, 4143 - Serra Verde, Belo Horizonte - MG</span>
              </div>
              <div className="flex items-center">
                <Phone className="w-4 h-4 mr-2" />
                <span>(31) 3916-9000</span>
              </div>
              <div className="flex items-center">
                <Mail className="w-4 h-4 mr-2" />
                <span>egressos@uemg.br</span>
              </div>
            </div>
          </div>

          {/* Links Úteis */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Links Úteis</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>
                <a 
                  href="https://www.uemg.br" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors flex items-center"
                >
                  <ExternalLink className="w-3 h-3 mr-2" />
                  Portal UEMG
                </a>
              </li>
              <li>
                <a 
                  href="https://www.uemg.br/graduacao" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors flex items-center"
                >
                  <ExternalLink className="w-3 h-3 mr-2" />
                  Cursos de Graduação
                </a>
              </li>
              <li>
                <a 
                  href="https://www.uemg.br/pos-graduacao" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors flex items-center"
                >
                  <ExternalLink className="w-3 h-3 mr-2" />
                  Pós-Graduação
                </a>
              </li>
              <li>
                <a 
                  href="https://www.uemg.br/pesquisa" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors flex items-center"
                >
                  <ExternalLink className="w-3 h-3 mr-2" />
                  Pesquisa e Extensão
                </a>
              </li>
            </ul>
          </div>

          {/* Redes Sociais */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Siga a UEMG</h4>
            <div className="space-y-3">
              <a
                href="https://www.facebook.com/uemgoficial"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-gray-300 hover:text-white transition-colors"
              >
                <Facebook className="w-5 h-5 mr-3" />
                <span>Facebook Oficial</span>
              </a>
              <a
                href="https://www.instagram.com/uemgoficial"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-gray-300 hover:text-white transition-colors"
              >
                <Instagram className="w-5 h-5 mr-3" />
                <span>Instagram Oficial</span>
              </a>
              <a
                href="https://www.linkedin.com/school/universidade-do-estado-de-minas-gerais"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-gray-300 hover:text-white transition-colors"
              >
                <Linkedin className="w-5 h-5 mr-3" />
                <span>LinkedIn UEMG</span>
              </a>
            </div>

            <div className="mt-6">
              <h5 className="text-sm font-semibold mb-2 text-gray-300">Sistema de Egressos</h5>
              <div className="space-y-2">
                <a
                  href="https://www.facebook.com/groups/egressosuemg"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-sm text-gray-400 hover:text-gray-300 transition-colors"
                >
                  <Facebook className="w-4 h-4 mr-2" />
                  <span>Grupo de Egressos</span>
                </a>
                <a
                  href="https://www.linkedin.com/groups/egressos-uemg"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-sm text-gray-400 hover:text-gray-300 transition-colors"
                >
                  <Linkedin className="w-4 h-4 mr-2" />
                  <span>Rede Profissional</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Unidades UEMG */}
        <div className="mt-8 pt-8 border-t border-gray-700">
          <h4 className="text-lg font-semibold mb-4">Unidades UEMG</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 text-sm text-gray-300">
            <div>Belo Horizonte</div>
            <div>Barbacena</div>
            <div>Carangola</div>
            <div>Cláudio</div>
            <div>Divinópolis</div>
            <div>Frutal</div>
            <div>Ibirité</div>
            <div>Ituiutaba</div>
            <div>João Monlevade</div>
            <div>Leopoldina</div>
            <div>Passos</div>
            <div>Poços de Caldas</div>
            <div>Ubá</div>
            <div>Campanha</div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-gray-700 text-center text-sm text-gray-400">
          <p>
            © {new Date().getFullYear()} Universidade do Estado de Minas Gerais (UEMG). 
            Todos os direitos reservados.
          </p>
          <p className="mt-2">
            Sistema desenvolvido para acompanhamento e gestão de egressos da UEMG
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer