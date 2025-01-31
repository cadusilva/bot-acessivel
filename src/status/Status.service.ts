import { IStatus } from "./Status"
import { Subject } from 'rxjs';
import axios from 'axios';
import { Post, IPost } from "../posts/Post";

class StatusService {

    Status$ = new Subject<IPost>();

    async Post(status: IStatus) {
      try{
        console.log("disparando status")
        await axios.post('https://${process.env.INSTANCE_URL}/api/v1/statuses', 
          {...status,
            visibility: 'direct'
          }, {
            headers: {
              Authorization: `Bearer ${process.env.MASTODON_KEY}`,
            },
          }
        ).then(toot => {
          const post = new Post();

          this.Status$.next(post.ConvertMastodonToot(toot));
        }).catch(err => {
          this.Status$.error(err);
        })
      }
      catch(err) {
        this.Status$.error(err);
      }
    }
}
export { StatusService }