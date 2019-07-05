import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();

const sgMail = require('@sendgrid/mail');
const SENDGRID_API_KEY = functions.config().sendgrid.key
const PDFDocument = require('pdfkit');
var {Base64Encode} = require('base64-stream');
sgMail.setApiKey(SENDGRID_API_KEY);

export const contactoTrigger = functions.firestore.document('contacto/{contanctoId}').onCreate(event => {

    const userId = event.id;
    var contenido = "";
    console.log(contenido)
    console.log("Evento: ", event.data()!.taller)
    const db = admin.firestore()
    var docu = new PDFDocument({layout:'landscape'});

    // write to PDF

    var finalString = ''; // contains the base64 string
    var stream = docu.pipe(new Base64Encode());
// create a document and pipe to a blob

// draw some text
docu.fontSize(35).text('Diploma por completar\n     el '+event.data()!.taller+'', 250);
docu.image('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASEAAACvCAMAAACFDpg1AAABuVBMVEX///8AAAD+/v4EBAT7+/urq6uqqqqxsbGurq66urrAwMC3t7e0tLT09PTg4OAICAjT09PMzMzm5ubv7+/Z2dnGxsaKioqhoaGQkJDp6el7e3vPz892dnY/Pz9/f39OTk5GRkadnZ2Hh4dYWFg6OjpoaGgmJiYxMTEbGxsrKyteXl5lZWUhISETExM1NTVKSkoAAAiop/2bmv/Q/ZKAevgMAACfvXHj/8Kbsnvj/rJJRJXu/t74//fk/8ze/qrV+5g4SCLv/tVkdk5aKCm8dnPklZvMhY1XQTspNB74/uvP/Y1OSuS8zpbL27OEj3VFTjwfH21PUvgyMJxfYv+JiPt1dv91dulfaPJLTow0M0RLSMEiIGRBPKMoJWAqLydfXc2mrdwcIxarTE7qcWX9enj/eou0oKFbeTqq41a7/0q691CGsj/E0bwmIy51lVB8MTr5kYX/rqh/R0y3/GhKXDwUIgf+xb9MLzHL/3yHnGzStK75oJr/x9371du7SEr/vsObxF+Cg7y3t//IyPwSE0SdnOTX1/3n6PunpP5RUnoQDzOOit6PkcpYVd09OsgAAB0vLossLVl1cbZGwieAAAAgAElEQVR4nO2diZ/jxnWgUSAIngAPAARIggfA+x5J41Vkx5JlO5ec3Vge2XKcZI+svRtr15t1tPFOks1uIm1s2bnzF6feUSBIguyeljTNHs/7zXSzSYBAfXj16tWrV1VauJ4upMykbKWMpfRAhiC73W4wGJraqfSXqwlLyLJ/3en0+/04bkkJsiSKIr9YKXdtx8Av03XdyLjGlchS3CiBpp+cNrv5tNvIZrxqVVzrHsp9e1mK3F0IbW8+7Rk4jaI6a9PzLv4t5I46tP3s+DClsKRrxjXWtmshBNJqXqMW3YJQ9PnZob3ksNpObA0gXRWmWxE6lc+ckJK+o+mGfk2IRldFSOrRvKxdFaDbEXoOtSwl8QPUodMbXnyOhMTA0Y3radSukFBOjC3tJaHLiHpXVNHuaKk/V0JSltfT4l8noVzmRe9HbkHIzzht+nkTEu61mKLBVRKSMrwWS3Q3QvrnT0gUnj+MTLkVoZOneSdCOeh5TQeTTj/ur3YbIS5HUDYPqZadElrfgZAQ61VgmvlivljM5/3WaHPp2JxUoquoZ8+R0Cb08ybAKUoBUv7kghJJp+g+eJzKALQf9B/rAL5G4RqQE9l26NkI1eCLRpJPoVgoFKpS5K9i3sxHOxX3yCAk7KtoznY3l+/TEwL6fak0AKfCIilJdTJDcd4cZYXunr+M98Wobebz+Xo9n282m9oNhObPRAhKK2tWoVCpVkqlUrlcLpUkoipUufj8OeOraPCbzbZlgFh7cRz5j6Rp2/W2cWqHFEGojrlzFWUPHwBJBaogHSUSUqGQL/bPn2dfAyEziPvhZLkcDYa98Xa2WEyn07X8P13MZuPecDdajsoZltoPwtF2k2ZwUULQoEpF8vESIUTSGp0Pc16FSxRcLhqImUEojqqea7ebrlcIOqObvKMh2KCCVCDPayhRiPKmeTYc17kPIsdiaR48w9wFJcgipMzXdBAG+bLddF3P7K966hRqDklkhfTzBVnDiE+3263Xu13FSFY0Mzing8Pnz+NUhpOG1m5dNLxZhNyjqrGZDTp+uWG7jUI8OhwqyollMV+osAZJPHXXdSUkRFSqFKRrNDhDaH4No7HysW99w6iOuTS3I2Ss69kPfr0Lo1LdrpeC1T5AEuWBkLRBwMdlAUasRPmzVb15H0iOhCpGx9a6oBW1rNqWpUM14VWwMmWXbLpqVbquXQ0guDKGdgw1CADZJMCoi1okTVEx2xLVROM+kByJMh29staGdjejzPkMQrIZ8xs3NWGbVVB2bS/yiVCjIRUI6DSbTUC0J2ROMs/Picp9IDmSHhYTuEx9y2rxnd1EyICGvm9vziNKSG92fr6IdlqqkIt42m1gxPUMLFG+dYZQVmLO85Ze6o5qgeWASagdFjx/epaBh0yaY2yqbhDZHVMqJAG10ROVkGw3sUSmmdnNv45YbC99QzAobATiSIuKp2cZOTxm1B7c6CyKrbTT1b0KtR1024GQW280sJqZ+TMuUfD8gZxIWoewrGHbOGpasgjhBzWxba9uJDSQ3mLlgJDs4jChboMN0Tj73Pj5AzmRjFsLHauTVo1ihh1SRKfN/k1aNCjm92ao2QRAshMIPb6UDvWyz+3fB5IjyXx4faeZal3OEgJzXLPjGxDtiqlaJglJRFTL7ESHHhYhKm1guDvVIJ3XIfzYDS5b62HRPG+HuLnPb7Mw566ilp1NJvO10pxu+6wdYnH9S4DEtGhWqxV2qCUhbMza0Ny76BBVqsW8v87Sw9xVWOozhMDEeNzxv4mQ8PyL9cyXOlSRfY4u+0PtdpsAJf6QGZ059YoJoSztJvQa8pDwnJZDQhJOIzrfAZENkrRDVeqVoU/dRJ/aVj419l29CG7kqNOTg0GE+5YbUjZjvbyROnQSUDeOjpNadN4YQXNfTTquSb+sTi0ZVDJzJyYlr5M76vRcR6/jIiHZVJWMMMP1PyYkvOjC18huB4fP6kd9e1YhNGS1frl4PDZ1DT3Xi+l28EBHbec0Tn1CCCpaLdsa5cSkWCxyfKh7Eh+Crv2Ez5xFlXizDxnkhH0fSI7kpoREea/e6ZDDKSHRDc6Y65zYRGaRAkQexhhR9oBMP9UrW5nBXq031xBBu2ngKwejw4d2SM8kJOqdsy3aqIiIQIu8fZxaAiphKD/J0EHdGQfRkP++ilHXaE53dqG5rp71qVMi7bSNfbRHUvCH/JWIbM4KWNGOxzoqxYzhoFoY4FCwCO+DyLH0Gw28w09LCMSmaTSKTIqQCKQSFQ7Hy2BQsWCaZnDcCKL1C6EfkuGJPX9Zi0VUr17Mb7g1oXlzK3KPUI2OHZtNlDcBUaXCQ67IRzZj+ehkFIHO7Q3W1zGiiENdE89tpdqQOxKqiW1znfqSR+nvm7fyMCx9MG4vjXQxPp8isx5eRVZ1h+5mGtmlc4pUPT0rk5DkMXLhxS/+4Itf/OJ3fwGMUh9PZI0qHuR+5M8FqFlaV5H7EbkFjjxMunbn0xEC16crfvH7j7/z3nvvvfq3f/2jgw/FrAUJMUUSSSefj2cXDaB9Fbkfc1kol8mMK00fRrmOXL/b1jJpfWoi+Lu/f//xe6+SfFeapbS9nnUiSK7K5wGV37noz9fE8CoAaWAne0Wbx87nQbM8FOLOhB6Jbz759nckoE9ekfLJJz9PVzR4tRlPQpge3A+HF3P0gNA1dMqklEK8nbhZZjMU2vWjHOtbt2XSD/rF3z95LGvYKx+hvPI3Pzo44KRGXQqaTO8DR4aMgy4ZokndDunWRl18ldS1jIzLbDska9T3nnz7MQD6+OOffvzxxx999NfioJrdVsBFKt8HjgyRtmBU7iKbXrnZIijyVcrRPRmV1jUrs1yPxP//hiREgKRIRFKJ7kII0iGuoiHTOE4tncYITPSsYEdrfILjKjVs4NGc5MLqWjtr+FpqyzffffLt91795KOPf/qzn/1MInrllZ/fhQ9ob/NaCHWjzmArzXXfrUJlm/vNInVmFxVgBE5f65iQpVmlDERSWb6FhF4BQob1s59KHfqXO+lQTmQkvt2TDMOGNxn2xlOxanTRWAft4ob8l0oTa99J/9HQKmb9FJFE8Q/vQi3b69BHn/zLHfiIzBzu+5JgN+0VPbLRY89FHzdoFhdY16Zl2RkVo+NzdM0XAaU1HARNHyWEPiI79NGzE6IwQ3AtVUxKFAZRVHCaERqkcaGOjFq2SR3KntfYbayj29U1SbTTnB5pkST0T+8+eX/flsnm/tWfP+PyF/iV15DQkEilN4WmdR66TrRaLmTVqq9Qj9oR3fKoXnWOLbU+hg5G+3jxj0fi977xLjf3KJ988urvPqsdyl1PO09S8rRyEJl+MJo0qrPpbCq2JRftkd+E8eYaJMEcE2piSQbOluYjKECPxD/KaiZt9XvkU7/y6qt/e3t/CIa48ZE41zXh3he1qCSd6PmyFTQscqwXngddj03RniCK1fEt8yDrsD1EABBURBUiJXr/seqYvffePz+Lxwise9elQFLcwI+KzUa+vxrKVn5Qbpur3VwMG1UIHM28Lvrb7cNz9Bk/8157p1QIKT0CSyQRyYoG8vjxFy+mIZ/KsGRckY0mqeOdzYO2GQa+H/X7bmk0GIzFqo5D0ss6NP19TWctwlFIk594TfSaoGz/6Xf+PWuARPStb7z7/vuS0XceP/7Od8VxtPFYZ2o5/Ec30alryYWuR2x1u7EHVWoYthptE8ca+l1s1jqQ/lLl5Up0WI+rnn7o7d/9nd9+/e23/+2/Yy0S4puyoj158v6TJ//hP4rbm+ltq3ENQz8ZYpSbVd/3zSgI7OaEHuaq7USxxJMvYwSn6O5EkOi+nk+MM/zavv2GBPSlL73+21TLINrxe9/63ve+9/t/ICZFeciNjGrDid918F6urYKRLGZ+IO3KZr7YLn2nG0VBZ1Tre5NBEKyWZaxq43pRbFqNpuM4Fhxb+wJHo2X5v/LWm1/+0q/+6pdef+NXJB0cCNoXvrI6sEPrKFksDtaQi8xCSX5pcidXV79YpPO3CHyeiDc3i+v5TjqRBauxEOvlsuhisCh0OTISlacS0Bdkub9A2vFvXnvz9bd/67fefv2NN3/z0bHJmR/2Ta5igPDZBc3uNFDR6m2JcpsXq0bTD2eiVzVxNKdSIid7VMc+/xfgByB67Z033/jy229/+Y233vrqsfucEx0z/XdPB2uGYhj46jqr1aEYjp83TdMveHUvivwoCE2VwzhpxLEfjSZlnJiyBDRgp0yv9rWv/9qv/wZ6k3/6ztO33nzj9ddff/O1d/4MkKXNjmylGuksQNQhVZeur9E6I4ahhjw3gb8WtUVvNPGdUhS0VgsRSddwGMuOLLLJe1PKov7zH/zFT37y4/+NFeidD5++9tpbb7312tOnXz2xyjkxaxwTenCia/sZAwszoPD6NB9vxmHL9MsOdNLmIXoCYgTWSFL5wx/85C+d//d1tDF/9cHTd56+8847T59++BVx4kDnhJ8KVj5MQoZuRxSVBhn4XMPCKjb065Fp5zuyppQiPKQIkTPxf7//4//zlz/5OjZoX/ngww8/lIr09IO/EhmSy9X3kz8eKCHNEjszFJvebrRcrSZmdzUa7caiZvIk5p7X6fvBslVA9VlB2/bH3/+fP/7xX/yJrFS5R+J/fPDBh5LSB3+UBQhYm0lz9kAJGZpXLZTsehzH4QSmBPteGLaCKCg3Cq04HMyFL52iXVx0aLgI8vH+8D9//we//l8EDW/81z/64Q9/+MF/++8/yuIj4TSSgcPhfRf2TqJzxyOMkmy0hU8DZhszhmmsZtTo7jCvutLbwNICjbX42h9/Tf6eQmslLc9Xvvq//lTs6md6qWPvYRMCwcyodcDzMuX/TkCDZSG5M7VdoxtEk3W/uq5JYzSkWK3oyRqXy7Gb+Eh0qmfCiRU1Qjm874LeWVx+2H4yvXcaUZWaVtiRDCIxasWlJo2DlH2MrW0a3A7CsgSPhHlmuupCtfjD+y7oXcXQpF+3XYZxy/VKvvQeoSdbsaMggu6s3wmXvY1YFaGMs7qJM6FbDQo/mtU0Cm+QVdFqwg9Ju4b3XdK7iqEbrm3G4Wg8XwehKtgsonUGwspw2ZewzCbOfi62FoNpTbpGQ6yPcSOVY1dzs/IhZZelS692913Su4puaZ5ocQ1bRnMV2QrY3BRxXvh64TUCvzXwffx0Uack6GV9rKIhOTEoZ9WynIjCh00IGrRIrII51pF1MFJ1ZUIuUc0cEQNpyxeT2OMskXIkSdXE2B3sM/OC7JVgat0HT8jQJrJfxivCMxhRqw2KveFuOFxUuOsQFuDnqNnpy16/8D30dzZuuGdRGoosocr7gAlJJTJ2ssZIEJvBKvQbsrefN6MgjssB7p8Q2Rj36pv13hQiJHMxHPVER3pGNUjaj9Fsg8zP1DNUosF9F/PTiTMchoVGKUKL3UqyPlvkzEwiLP9sIFFFceyCadqIZXeLbKpREnQcmaeAZHMWgNV64IQsKxhMRagy0Sg3Rv7vTzCFc1mkD6blhZjvQpeWwuu5NBxkcvBaYopGp4RgHPXB65Cu61ZPPmyoaTARboDT7kEzwhCrUo/X+diU0YlsjAedOOzN0a+uiYhCSKBIpc1p9h2Be9iEQAxo3sctQrROkuVXZKenBf6bEMHP3HC0a4bIpVUVbIyGERI9knXxRSCk41oE05ia/VwLjE1uOh628quw3+9H9T5sfrMcuaO5ZMEdklojxsHFVkHZnDijngkRjR8+IVh6XfbXRS2G3te8t+r6kPIQd1ZhcbxdTOfj8ni2HY6WK8+PZYekuVyg0pRijL/1TVAi0J7MudPj4OET0jCHU5roaUmS8ePJtqUWChhQF3WqumEF6Jyt3bjfak2moiI/XU4AEc8Qy1wKJnohCMk+mmZ7rVHMaFq0/lYNDbfUELJFYI4hd2hTlbqzCMNlN65o0s3s+Gyj+6crQeTEMBw8kNGNS6LDYI3h9US4A3OdA3eI/JxlBxOsxybP+S4sYCTDxGo2h3lgffl5v8WLGUUnnXz5Z/hC6BCKrnuDkNWgr5ZFXYXY2PciCvpvMI1vK7WmZ2JKAq6QEoesL1lbWo2W912wz0xgbrTb5UUWE1s0oSZqF4jpYrHeTCO0v6Zn0CAhdc6Ux5k5K+oaVvH4zAQK3Q0wdE1xovVgWQ36nbAfBxXa7a5jTgCPZlBir4tTMytNnKdZKns0x65AU6VMGNY1vRfADqUFitOu9AfCH0kek6HsklD3dAn99+3Et61UiW81Av8QhulvL7rBe0BZVjsfhMuh9IU6s/FwFHa8kgtwDF3br1XAi2RoqbSFA6H37rE8n4/oF3Zc03Vq+Y7e1Pkz7fA34/t8bvMaJL2Wyks5kUMqLzm9lJfyUl7KS3kpL+WlvJRD+ZTO4WFngzZEPr8tsn7w6xmucoc7e2Y57FEl78oOp2HccR9j7K7CfjLJyTd8m86Hny7elymGEjzvjpRomsDdzuUv0CznjmELLun++vzibGH4yFuWVoF8PvtQJxiPWejWSojx3bZ91LX2UizMFJElbLgzPj8LKBoOpFjHsYFzUgjDThhamuZEHd84qWv6jXctL2AXStbFWmrbsA5pW9ObuAWCc/y5TrHXk/dvI7qDITe1/K28HYzR1s6XnBZCcrKeVtbkMz6csnln1rGFQJt3EZJBU3YvLh1KACL14iSUzHMY77aqXUQnG8kdI6HNrQlZq6WU1Sps5e0sc9xnQktMvjhZiNgejAaty3dI07vWl6ZHUnKer16crPFRp1neWTuW3iyY4VlTE4mfmZBupZIkl83T05iQQQtpj5J750cCg3v1y3fo08ITl45KEcqhDh2vgkL3d7clbE38zvn+KxWhcyccEzpY5+q0GEyI93maaHo5CIIocIzk2yY3OAJYyXLCveAwnBA6FF0rwef9u3kcFt569ZkJqWppHeyQNj0xKaqWUaJAV9Mov1CttzuVLy83i7i2gmyJLhmrUx3ieDxHEw3NDWLvJDSvKUOoJUdSvB4+U66VrlnBbulpfITGtWzOQ7vsONK1KM4fnupQss5wDjd848vraaCaFmzEvCLfJEJQH2GYARoJS82Cp3vdF4Di7BpkfvUIqa7KRD94HHBPiIaflWGjlgO8Mf6bvyPlV6ZaZPrUgHbDUM4J8kpO1um3IkSuDP/Ez+nQUBWZCZEdKteHqhqpA+mrFSHps7UNuDSlVDTJgzQcR1c+EwAzcMSFfUyd3Fddc7quQXcAj0xXLi2pBBTphJArK3IUGHphNQrrsNQQpugbkPppwt+lQrVQhaUnmsFyN5gU0Q3xSuVyydWcVl8e4ZjhaBK5cAuwlrBnA8VmELbaRGgNxXSiMLC1Jq53DqU1qrHfZkLKPyFCOVl9aF7FFt9sFPNVN61DltJpNZuwrVHZG2WvzQ9H/mg2Gm1t/8wMQ0v44dtS4+FW8MvaqVUqTghV6DHQU/OUF0Dbta80w8E/o6QlByOu01phgYcTE1Q27NjTqJYDNXqzjBdZyBNoqkeJrm4ZGk0YKSml4KoAhHI1UdehvaihI8WXnZYAOxNiO+SqJNMNWCKa5C1mJdL8BhZopAWL8Xa71CCDDr7DGA13u0EMOkab1oHF9RYwGcVdTSbhpHFMKICyyBc7yl8YKIQaThzaqlUwXATEKzRJC4mXH+AJ+xUd+kxIWn96IWrIYSp9YM57wAHvucUmXZaHCR3WsjrqUA5M/DKZvxRpZwmBrU6mbNHaqXl6vaVThnxkXaO2YAV1g97qafz0BH15hVUkRaiUZLXS1VmHPHzHocnnC6NJ609iiYdMCB73QFYkdmJmhp4QOljgeQoKmPJ01gYXQK2JtSdENBruju++pbKSc6jfqlISITtFyOJ5qXBwGWc/4TePidCUr9XXrDkRwiNyWBg9tdRoTpQYgKlqU6BYshiKkIVf6tIVQtlo1Gpi7egD8iaQEFxhoFH+UD2WDyghhPdBpcVaBmvP13IKmiQEBOANyhW1krYsdauQIGmls2yHegYhygcTsHSSfF2N4Da3VDhIexqrlYIxUVPiSAiN+M0hqFACV5wnNA2PCNFvk/ZmKGm4i41081HjTCYkn1FfxwtJnXTAPOO5LTa0m/IED1rj+5ArShdZG7wAps8XzSBECIr0FDxK3LGzCJEe2lh5Iq4Z7Tbf3nCoJXni8LPHtWzCnStZkVFPBaRx0htnCZX46ntCeBcAQIBLh/eybAU4vTHgWjaSjoxBTt7Qk8ZPV4TK3Ao4TKiBFw+1NhOi+xtp2kVCsUaJyS7eC7hHh4RcwyAX0rbokZQdB8/oUusjC2WwDgV5wTrEhDiRt6o5XOCu3uNzyPz44O6SHaJvq7O/uieEpejZVJQ2zIthha/J6kzfhqslm7zX+cTZ61CVL8brYzIhn/cxWBt1vjY3C1bSlgmxn3cUG7ylocPnBwmhiAhpiceYml0iTy/T5729x8X7tu0JBeoIQ6N9/Wgv4L0O+XsdOkPIMEC1N9jT8hHXPlMxpOutLXQfY7Yx8k9FiGY8eGzRF1yAvEY+xNpoqMeU+EN7QlwlJtKs0eE1R6PJWPEpoT4Tqoi0VMlNmlwg1OeCyHIu4JILjRW1rOHCeVBjZ3yX53SI9HNHd9DGs4u0QXfboustdPKvwfUAfEsmFOx1iI7Dphi3kWQd6qqbWB0Q0phQue1QutKMdaiLb7cuEYLCdGKQfse9PSFjT4haxrJG+5Bsoli1jIpQ55CQcvqkBm5wbWGpJ3lNd2APF0deT548I+sh2+oGFcVShMpci8gOLbCEsmnSyP2cGi62HiGv2i+SaA3bIZfNEtxLTakIRGTOEqILJvvlUh0aa/oBodxBLYMTdvAcaM6lOqnMFYCeFX5pNYtQDtd24MNgP2xcijHkC3oJIejKTAOLna62IkSGc2qTmZhSJRVrO2BCRGru8nz0Qx2ConMnmnQhYnNVPiJk7wmR6ZfVOh4OBkOnQjcetevnCFGcRlSNpkabZ9raji9ChcjxVtk9ja36ntCACfErNF5gbODwkJKDD3SoBSsXrg91yNn7h6hDxprNWI4IafPUx+d0SBIit1WwS+ecI9TWaEGckUVPioDBqdtztcxVFx/id0jPiSo8uJthsmuY/NayzjrErqFIQssax+Pkf9ltArB4FpwbcBs1AyOkvFeYiMWPUn6O6zrWuF3acvK1uvCUlANimfRGssoq2yFXEdNn6stz4BCfJ5Q432SvNDV1d3ioQzuN+jXS/ihHesA1VD0wSchKbfII3bZCFqEcVGFeuGCE3V9TfYUYWEaKUGoxHXtPSD0ifGILbe+gMaEmf066dkhI7AlxI4aHzqXlpqxt45QQ9Xnp2Lk086qzODzUoT2hxD8YsFopvGWwLzHXgUUBIjqZhERqO6UIw19aleN/oSX/wGZ4CoSMEj+NuWyeCURLDSkIn7wCTQEOsPXfJFcNuS3jeB1bcmWHAFHSJ1rACt+KUKAIdRQhzVXhybULFoLNbS8hNGZCdF3NYPdHDHR1LDVRtMSo0837ftWlJ2fhvs+G7sBmfk3DaPNvGP3Czf3UE7YqrU7sY3jOcOsgFH0x6kG47FfBmFi4gRIGcxqdQVjXPNjtxYO4VGM1Xpa1MkSdCnBoY7UYFLQyBKP8vU8dgQTpJUXbwVjWxoGJMSUTW3NLK/f7/U4om648TFueYIzSaYFxWwccbKrjk4611m6w2+0Mfdkb9sYTzRmOx+Mtxp5L+Jg76vFVvM10OoWVxPdDsoYaVOfgGv6kmB6GmjglmhOjDxKBMYBpUFBqH/NVY1VJJrWKPxtHf6ub0PefU+N1cA31Hg3J7j9PHcfX46Bm226rk+U7lm1b+7tWRd6fqmt2o9vEsx2vkUTx6AsJic5/GSpQTa+TkXSd88YNvmssCQKhUXNa0lWFMA2ElgSvDV1dhGOhqYCxkQzx86n70WndOEja5lug6HAqOp7ETPkyGnPU6W6IgHGcCm+oZ7cPzaMuqGKkhqKP5S4DGyfnfOqx9M/+G293mZfyyyp6Ki9JP3hXT9mbF1KkXWg06o3G+eQKZc+k7bBw8MQiSGjhmo6mX+mSvJ+dkFuVsa1sIonSuCknBv+Wfs/S+qUglMvaIl2JbJS8KIiKNjvPCSELwyvL8zldL4iQDmVs8EQCgU32oOs0bOSpj7gvcafsp4cklwnpmpbMqnWPCPH6AM0XvUlXhLIFovM53pH2WIfatHXNc0l0vE+5SIjSN7gvfqxD1MXqvuCtvSKU2orvQCNojDQnNpPVoQ6hH+T6RUd7YXUIymW7FhDKISEop+3aRrrLSSP0NbGEzikOlNWQkJVKpaVsmH13O0n24deq72ep6xrpTvAVi6HVISIR7Qk5FOke1ff9eRWzo7A9+UONdijELC9dxbgvBV5g/MfXglarFRe0btwKgtjpDkSuj9Ec3Z7Uah2nHkC4Bd5xO+P1OPSuGZBOo9ow9LZiQpxDI7Cs6igaJxcT6qfXsZbxdvAeBsTxMx5nCqcUMKMgWURRNdAcqshbjlHqmlrAdeZdusf7FwgI5lSaQRU3fVSpH/WkoilkWInqidEWuBUjE4GqmEs+CckLqHHgN5DnDdXaSUgICULzCNld1ywchOWyFTlU67e49GxG6BgYgNH0g/1oxHZPaLT/qoSQko2xH+rAzx0cXsWXN6Rj37fQqAOmoaAOcSCVcg2UMeVoP9aGwx17wA9iQpRCIYaKECcy0A5RUh9pQFElNTltSgUyzNGV75fhc9lbWLcqpC0Fp43ReFc70CHsihGhmhhV0P4sdH1NRKiJm2iRSBNa8QCXCUOU8hKuQ/bLIeVtWdq17yhC5rIJI7hAqJ3WD+Gpppv+NMn9ITvk0ZDGQjeYEPXPKtzUdZhQQRpoGi7nfAK25zxCKja+ceWE+mhJHR6lLNnKWLDScPB/zqXW0oQ6h4Sqgtyk9gGhBlu6mNrD0T6FXcLLtQ0AAAJQSURBVGVB9o63/7syQedn09Ypx7BED7zPWzPZKgZPqfIbBwceyA51SYdmCSFKhWjwGPwxob6G+R57QrrW2PC20e0b7/I+heynrdH2uiUqTjIAq/Sf01xD8Kk5z+aEUFlQwsFhLStpTa5lOL64VUECB0ZBItpnpH9PZb+dmHz/tJx6iWyydIvC2Xg7S0wEgcuJXhzO3UMd0ow5EaHuWsi2v8MeY1/ShTbAZGfA0hdEyNDKhmZh1uX2fhHcII1UjgE8cUyK6bmoAKmJji2RLD5vHxPaEBH2rNgr6mu8aOJqg057FyyeRDWkHAUBlm9YcmD5VzDfVyxGkjRDhJLsxBykeSbDjtZ+X1kmVD8mpKkdMXNEqJi8Rt2BtJvUlRzOy4T3JvfM4AaBxHTK/5U/K9gY876Ug6SjDrMw0C+sKUK5FCGcmydtSYU7EagrTAh7HbkamhppdGrYv4GFkq1gf9W7Tax7XmIYVC1M1iHNUp2H5eGcVmfJT9ymlKqG8of2qR2UthauSYfoG0PUxjlEsWmuxoaOcrxk/5uTmaHXJbL1jnbbTtOKfN+PcKZrebKYLyblwwmdslPfkGXf7CLLjltxv2NrxU6/3w8MK4akkCJ8EzTkvhGupJhMqA2/Bm2MflSkts26ld5uOJxZmlHEvJ1Z6cqjk8mE+v076oVxREjjjA8+4SgrBCNiRnu/VgQRamoGzBKnqXiGnUykxe+z3HpTu2Gq9QssTOi6HeZnls+yOC8moZvlfIFT6WCpLMzm4TG/dLzOikSRhww82eO7BZR/BVKhAcADwQvuAAAAAElFTkSuQmCC'
, 0, 15, {width: 200})


// and some justified text wrapped into columns
docu.fontSize(25)
  .text('Al presente '+event.data()!.nombre, 160, 200)
  .font('Times-Roman', 20)
  .moveDown()
  .text('\n \n\nGracias por participar en los talleres impartidos en la Universidad Politecnica de Chiapas la fecha de '+ event.data()!.fecha + ' donde para que los jovenes estudiantes puedan tener una mejor formacion. \n \n  \n\n\n \n                     Profesor Alí Santiago Zunun', {
    width: 412,
    align: 'justify',
    height: 300,
  });

// end and display the document in the iframe to the right
docu.end();
    stream.on('data', function(chunk:any) {
        finalString += chunk;
    });

    stream.on('end', function() {
        // the stream is at its end, so push the resulting base64 string to the response
        console.log(finalString);
    });
    console.log(finalString);

    return db.collection('contacto').doc(userId)
             .get()
             .then(doc => {
                const user = doc.data()!
                console.log("Cosas: ", user)    
                
                const msg = {
                    to: user.correo,
                    from: 'marco.antonio.mulato@gmail.com',
                    subject:  '¡Aqui tienes tu diploma!',
                    text: 'Hola '+ user.nombre +' mas abajo esta tu diploma, ¡descargalo!',
                    attachments: [
                        {
                          content: finalString,
                          filename: 'Diploma de '+user.nombre+'.pdf',
                          type: 'application/pdf',
                          disposition: 'attachment',
                          contentId: 'mytext'
                        },
                      ],
                };

                return sgMail.send(msg)
            })
            .then(() => console.log('email sent!') )
            .catch(err => console.log(err) )
                 

});