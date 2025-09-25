import { Router } from 'express';
import { getResources,createResource,updateResource,deleteResource } from '../controllers/resourceControllers';

const router = Router();

router.get('/', getResources); 
router.post('/', createResource);
router.put('/:id', updateResource);
router.delete('/:id', deleteResource);

export default router;


//nigga raj
//sotta simon