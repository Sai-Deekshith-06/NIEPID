const generateClassId = (v1,v2)=>{
    console.log(v1,v2)
    const ans = v1.concat("_",v2)
    return ans
}
module.exports = generateClassId