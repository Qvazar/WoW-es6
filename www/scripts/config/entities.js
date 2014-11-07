import DomSpriteComponent from 'wheels-engine/components/DomSpriteComponent';
import DomAnimateOnEventComponent from 'wheels-engine/components/DomAnimateOnEventComponent';
import SoundOnEventComponent from 'wheels-engine/components/SoundOnEventComponent';
import DescriptorComponent from 'wheels-engine/components/DescriptorComponent';

export default {
	"222": {
		"components": {
			"descriptor": DescriptorComponent.create("222"),
			"sprite": DomSpriteComponent.create({"sprite": '222-body', "css": {"z-index": 0} })
		},
		"entities": {
			"turret": {
				"components": {
					"turret-sprite": DomSpriteComponent.create({"sprites": ['222/222-turret'], "css": {"z-index": 2} }),
					"cannon-sprite": DomSpriteComponent.create({"sprites": ['222/222-cannon'], "css": {"z-index": 1} }),
					"shoot-animation": DomAnimateOnEventComponent.create({
						"event": "shoot",
						"component": "cannon-sprite",
						"animationName": "default-cannon-animation"
					}),
					"shoot-sound": SoundOnEventComponent.create({"event": 'shoot', sound: '222/222-cannon'})
				}
			}
		}
	}
}