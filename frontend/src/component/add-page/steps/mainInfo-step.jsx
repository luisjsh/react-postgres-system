import React, {useState} from 'react'

import CustomInput from "../../custom-input/custom-input";
import Custombutton from "../../custom-button/custom-button";
import PhotoCarousel from "../../image-carousel-add/image-carousel-add";
import ImageCard from "../../image-card/image-card";
import DropdownInput from '../../dropdown-with-input-text/dropdown-with-input'
import DropdownSelect from '../../dropdown-select/dropdown-select'


function MainInfoStep({hierroInformation, pelajeInformation, fatherArray, motherArray, handleClick, updateState}){

    const [Data, setData] = useState({
      hierro: "",
      nombre: "",
      pelaje: "",
      padreId: 0,
      madreId: 0,
      files: {},
      sexo: "Hembra",
      encaste: '',
      tatuaje: '',
      motherArray: false,
      fatherArray: false,
      motherSearchbarValue: "",
      fatherSearchbarValue: "",
      mother: "",
      father: "",
      hierroDropdownSelectedImage: false,
      hierroDropdownSelected: false
    })
    
    const [image, setImage] = useState({
        url: false,
        photos: false,
        x: 0,
        porcentaje: 100,
        porcentajeInput: 0
    })

    const [Date, setDate] = useState({
        day: '',
        month: '',
        year: ''
    })
    
    const formHandler = (event) =>{
        let { name, value } = event.target;
        setData({ ...Data , [name]: value });
    }
    
    const handleDate = (event) =>{
        let {name, value} = event.target
        setDate({...Date, [name]: value})
    }

    const pelajeSelected = (event) =>{
        setData({ pelaje: event.target.attributes.value.value });
    }

    const handleFile = (event) =>{
        if (event.target.files !== undefined) {
        let photosFile = [];
        let i = 0;
        for (i = 0; i < event.target.files.length; i++) {
            let url = URL.createObjectURL(event.target.files[i]);
            photosFile.push({ id: i, file: url });
        }
        setImage({ ...image, photos: photosFile, files: event.target.files });
        }
    
        if (event.target.files[0] !== undefined) {
        let url = URL.createObjectURL(event.target.files[0]);
        setImage({ ...image, url: url, files: event.target.files });
    }
}


    const PhotoChanger = (event) =>{
        setImage({ ...image, url: event.target.attributes.value.value }); 
    }


    const selectedParentFather = (id, nombre, hierro, fechanac, torosimagenes) => {
        setData({...Data, padreId: id, fatherArray: [{id, nombre, hierro, fechanac, torosimagenes}]})
      }
    
    const selectedParentMother = (id, nombre, hierro, fechanac, torosimagenes) =>{
        setData({...Data, madreId: id, motherArray: [{id, nombre, hierro, fechanac, torosimagenes}]})
    }
    
    const hierroSelectedImage = (event) =>{
        let { name, value } = event.target;
        setData({
            ...Data,
            hierroDropdownSelectedImage: name,
            hierroDropdownSelected: value,
        });
    }

    const handleSubmit = (event)=>{
        event.preventDefault()
        handleClick()
        updateState('firstStep', 
            {...Data,
                fechaNac: `${Date.day}-${Date.month}-${Date.year}`
            })
        
    }
    

return (
    <form onSubmit={handleSubmit}>
        <div className="add-page">
            <PhotoCarousel
            photoChanger={PhotoChanger}
            url={image.url}
            handleFile={handleFile}
            photos={image.photos}
            />

            <div className="card-information">
            <h3>Informacion</h3>
            <div className="information-enter">
                 
               <CustomInput
                    name="nombre"
                    value={Data.nombre}
                    onChange={formHandler}
                    label="Nombre"
                    required
                     />

                <DropdownInput 
                    id='pelaje' 
                    name="pelaje"
                    onChange={formHandler}
                    labelName='Pelaje' 
                    value={Data.pelaje}
                    required
                    >
                    {pelajeInformation
                        ? pelajeInformation.response.map(
                            ({ id, nombre }) =>
                            nombre
                                .toLowerCase()
                                .indexOf(Data.pelaje.toLowerCase()) > -1 ? (
                                <button
                                key={id}
                                name="pelaje"
                                value={nombre}
                                onClick={pelajeSelected}
                                >
                                {nombre}
                                </button>
                            ) : (
                                ""
                            )
                        )
                        : ""}</DropdownInput>
                

                    
                    <div className="birth-date">
                        <p>Fecha de nacimiento</p>
                        <div className='birth-grid'>
                        <CustomInput name='day' value={Date.day} handleChange={handleDate} paddingWrapper='0' placeholder='Dia' maxLength='2' pattern="[0-9]" required/>
                        <CustomInput name='month' value={Date.month} handleChange={handleDate} paddingWrapper='0' placeholder='Mes' maxLength='2' pattern="[0-9]" required/>
                        <CustomInput name='year' value={Date.year} handleChange={handleDate} paddingWrapper='0' placeholder='Año' maxLength='4' pattern="[0-9]" required/>
                        </div>
                    </div>

                <div className="hierro">
                    <label htmlFor="hierro">Hierro</label>
                    <div className="hierro-section" label="hierro">
                    <div className="image-select">
                        <div
                        tabIndex={0}
                        className="image-select"
                        style={{
                            background: Data.hierroDropdownSelectedImage
                            ? Data.hierroDropdownSelectedImage
                            : "",
                        }}
                        ></div>

                        <div className="image-select-list">
                        {hierroInformation
                            ? hierroInformation.response.map(
                                ({ id, path }) => (
                                <button
                                    key={id}
                                    value={id}
                                    name={
                                    "url(http://localhost:4000" +
                                    path +
                                    ") center center / 70% no-repeat"
                                    }
                                    style={{
                                    background:
                                        "url(http://localhost:4000" + path + ")",
                                    }}
                                    onClick={hierroSelectedImage}
                                />
                                )
                            )
                            : ""}
                        </div>
                    </div>

                    <input
                        name="hierro"
                        value={Data.hierro}
                        onChange={formHandler}
                        required
                    ></input>
                    </div>
                </div>


                    <CustomInput name='encaste' value={Data.encaste} handleChange={formHandler} label='Encaste' required/>

                    <CustomInput name='tatuaje' value={Data.tatuaje} handleChange={formHandler} label='Tatuaje' required/>

                    <DropdownSelect labelName='Sexo' onChange={formHandler} name='sexo' value={Data.sexo} required>
                    <option value="Hembra">Hembra</option>
                    <option value="Macho">Macho</option>
                    </DropdownSelect>

            </div>

            <div className="family-choose">
                <div className="mother">
                <h3>Madre</h3>

                    <CustomInput paddingWrapper='0' handleClick={ ()=>console.log('omg i cant believe it')}/>
            
                <div className="cards-result">
                    <div className="parents-card">
                    {motherArray
                        ? motherArray.map(
                            ({ id, nombre, hierro, fechanac, torosimagenes }) => (
                            <ImageCard
                                key={id}
                                hierro={hierro}
                                nombre={nombre}
                                fechanac={fechanac.slice(2, 4)}
                                imagenes={torosimagenes}
                                handleClick={()=>selectedParentMother(id, nombre, hierro, fechanac, torosimagenes)}
                            />
                            )
                        )
                        : ""}
                    </div>
                </div>
                </div>

                <div className="father">
                <h3>Padre</h3>
                <CustomInput paddingWrapper='0' handleClick={ ()=>console.log('omg i cant believe it')}/>


                <div className="cards-result">
                    <div className="parents-card">
                    {fatherArray
                        ? fatherArray.map(
                            ({ id, nombre, hierro, fechanac, torosimagenes }) => (
                            <ImageCard
                                key={id}
                                id={id}
                                hierro={hierro}
                                nombre={nombre}
                                fechanac={fechanac.slice(2, 4)}
                                imagenes={torosimagenes}
                                handleClick={()=>selectedParentFather(id, nombre, hierro, fechanac, torosimagenes)}
                            />
                            )
                        )
                        : ""}
                    </div>
                </div>
                </div>
            </div>
            
            {/*
            <div className="genetic-range">
                <h3>Genetica</h3>
                <div className="genetic-information">
                <div className="porcentaje">{Data.porcentaje}</div>

                <div className="genetica">
                    <CustomInput label="Casta" />
                    <CustomInput
                    label="Porcentaje"
                    name="porcentajeInput"
                    style={{ width: "30px", marginLeft: "20px" }}
                    onChange={this.GeneticRange}
                    value={Data.porcentajeInput}
                    />
                </div>

                <Custombutton color="secundary-blue">Agregar Otro</Custombutton>
                </div>
            </div>
            */}

            <div className="button-section">
                <Custombutton color="primary-blue">
                Guardar
                </Custombutton>
            </div>
            </div>
        </div>
</form>
)
}

export default MainInfoStep
