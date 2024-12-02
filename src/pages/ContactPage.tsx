import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

export const ContactPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <h1 className="text-4xl font-bold mb-4">Contacto y Ubicación</h1>
        <p className="text-xl text-gray-600">Estamos aquí para atenderle</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-8"
        >
          <div className="flex items-start space-x-4">
            <MapPin className="w-6 h-6 text-blue-600 mt-1" />
            <div>
              <h3 className="text-lg font-semibold mb-2">Dirección</h3>
              <p className="text-gray-600">
                Av. Principal #123<br />
                Col. Centro, CP 45000<br />
                Ciudad, Estado
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <Phone className="w-6 h-6 text-blue-600 mt-1" />
            <div>
              <h3 className="text-lg font-semibold mb-2">Teléfonos</h3>
              <p className="text-gray-600">
                +52 (33) 1234-5678<br />
                +52 (33) 8765-4321
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <Mail className="w-6 h-6 text-blue-600 mt-1" />
            <div>
              <h3 className="text-lg font-semibold mb-2">Correo Electrónico</h3>
              <p className="text-gray-600">
                reservaciones@hotelsantaines.com<br />
                info@hotelsantaines.com
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <Clock className="w-6 h-6 text-blue-600 mt-1" />
            <div>
              <h3 className="text-lg font-semibold mb-2">Horarios</h3>
              <p className="text-gray-600">
                Check-in: 3:00 PM<br />
                Check-out: 12:00 PM<br />
                Recepción: 24 horas
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-lg shadow-lg p-8"
        >


<h3 className="text-2xl font-semibold mb-6">Nuestra Ubicación</h3>
<div className="w-full h-auto flex justify-center">
  <iframe
    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d25114.793238880797!2d-103.33518342069289!3d20.655890603538314!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8428b1faa928f63f%3A0x25dcb2cdab10691a!2sCatedral%20de%20Guadalajara%20(Catedral%20Bas%C3%ADlica%20de%20la%20Asunci%C3%B3n%20de%20Mar%C3%ADa%20Sant%C3%ADsima)!5e0!3m2!1ses-419!2smx!4v1733099254078!5m2!1ses-419!2smx"
    width="600"
    height="450"
    style={{ border: 0 }}
    allowFullScreen=""
    loading="lazy"
    referrerPolicy="no-referrer-when-downgrade"
    className="rounded-lg shadow-md"
  ></iframe>
</div>






        </motion.div>
      </div>
    </div>
  );
};